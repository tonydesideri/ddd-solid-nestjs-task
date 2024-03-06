import { BadRequestException, Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ResourceNotFoundError } from 'src/modules/task/domain/application/use-cases/errors/resource-not-found-error';
import { GetTaskWithDetailsUseCase } from 'src/modules/task/domain/application/use-cases/get-task-with-details.use-case';
import { TaskWithDetailsPresenter } from '../presenters/task-with-details.presenter';

@Controller('task-detail')
export class GetTaskWithDetailsController {
  constructor(private getTaskWithDetailsUseCase: GetTaskWithDetailsUseCase) { }

  @Get(':taskId')
  async handle(@Param('taskId') taskId: string) {
    const result = await this.getTaskWithDetailsUseCase.execute({
      taskId
    })

    if (result.isFailure()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const task = TaskWithDetailsPresenter.toHTTP(result.value.task)

    return { task }
  }
}
