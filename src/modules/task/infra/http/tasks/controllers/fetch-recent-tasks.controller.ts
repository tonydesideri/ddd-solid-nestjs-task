import { BadRequestException, Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { FetchTasksUseCase } from 'src/modules/task/domain/application/use-cases/fetch-tasks.use-case';
import { TaskWithAttachmentPresenter } from '../presenters/task-with-attachment.presenter';

@Controller('tasks')
export class FetchRecentTasksController {
  constructor(private fetchRecentTasksUseCase: FetchTasksUseCase) { }

  @Get()
  async handle(@Query('page', ParseIntPipe) page: number) {
    const result = await this.fetchRecentTasksUseCase.execute({ page });

    if (result.isFailure()) {
      throw new BadRequestException();
    }

    const tasks = result.value.tasks.map(TaskWithAttachmentPresenter.toHTTP);

    return { tasks };
  }
}
