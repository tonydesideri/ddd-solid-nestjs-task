import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { FetchTasksUseCase } from 'src/domain/application/use-cases/fetch-tasks.use-case';
import { TaskPresenter } from '../task.presenter';

@Controller('tasks')
export class FetchRecentTasksController {
  constructor(private fetchRecentTasksUseCase: FetchTasksUseCase) { }

  @Get()
  async handle(@Query('page') page: number) {
    const result = await this.fetchRecentTasksUseCase.execute({ page: Number(page) });

    if (result.isFailure()) {
      throw new BadRequestException();
    }

    const tasks = result.value.tasks.map(TaskPresenter.toHTTP);

    return { tasks };
  }
}
