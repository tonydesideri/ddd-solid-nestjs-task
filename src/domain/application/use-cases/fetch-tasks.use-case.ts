import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface FetchTasksUseCaseRequest {
  page: number;
}

interface FetchTasksUseCaseResponse {
  tasks: Task[];
}

export class FetchTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    page,
  }: FetchTasksUseCaseRequest): Promise<FetchTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.findManyRecent({ page });

    return { tasks };
  }
}
