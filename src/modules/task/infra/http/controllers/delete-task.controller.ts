import { BadRequestException, Controller, Delete, HttpCode, NotFoundException, Param } from '@nestjs/common';
import { DeleteTaskUseCase } from 'src/modules/task/domain/application/use-cases/delete-task.use-case';
import { ResourceNotFoundError } from 'src/modules/task/domain/application/use-cases/errors/resource-not-found-error';


@Controller('/tasks/:id')
export class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) { }

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') taskId: string) {
    const result = await this.deleteTaskUseCase.execute({
      taskId
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
