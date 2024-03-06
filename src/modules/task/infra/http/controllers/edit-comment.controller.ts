import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Param, Put } from '@nestjs/common';
import { EditCommentUseCase } from 'src/modules/task/domain/application/use-cases/edit-comment.use-case';
import { ResourceNotFoundError } from 'src/modules/task/domain/application/use-cases/errors/resource-not-found-error';
import { EditCommentDto } from '../dtos/edit-comment.dto';


@Controller('/comments/:id')
export class EditCommentController {
  constructor(private editCommentUseCase: EditCommentUseCase) { }

  @Put()
  @HttpCode(204)
  async handle(@Body() body: EditCommentDto, @Param('id') commentId: string) {
    const { attachmentsIds, content } = body;

    const result = await this.editCommentUseCase.execute({
      content,
      attachmentsIds,
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
