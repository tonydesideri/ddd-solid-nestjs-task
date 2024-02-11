import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface FetchTasksUseCaseResponse {
  tasks: Task[];
}

export class FetchTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(): Promise<FetchTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.findAll();

    return { tasks };
  }
}
