import { BadRequestException, Controller, Delete, HttpCode, NotFoundException, Param } from '@nestjs/common';
import { DeleteCommentUseCase } from 'src/modules/task/domain/application/use-cases/delete-comment.use-case';
import { ResourceNotFoundError } from 'src/modules/task/domain/application/use-cases/errors/resource-not-found-error';


@Controller('/comments/:id')
export class DeleteCommentController {
  constructor(private deleteCommentUseCase: DeleteCommentUseCase) { }

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') commentId: string) {
    const result = await this.deleteCommentUseCase.execute({
      commentId
    });

    if (result.isFailure()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
