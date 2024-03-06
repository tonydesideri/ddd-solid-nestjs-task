import { BadRequestException, Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { CreateCommentUseCase } from 'src/modules/task/domain/application/use-cases/create-comment.use-case';
import { ResourceNotFoundError } from 'src/modules/task/domain/application/use-cases/errors/resource-not-found-error';
import { CreateCommentDto } from '../dtos/create-comment.dto';

@Controller('comments')
export class CreateCommentController {
  constructor(private createCommentUseCase: CreateCommentUseCase) { }

  @Post()
  async handle(@Body() body: CreateCommentDto) {
    const { taskId, content, attachmentsIds } = body;

    const result = await this.createCommentUseCase.execute({
      taskId,
      content,
      attachmentsIds,
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
