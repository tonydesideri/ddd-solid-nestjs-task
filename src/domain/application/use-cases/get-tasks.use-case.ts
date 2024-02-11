import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface CreateTaskUseCaseResponse {
  tasks: Task[];
}

export class GetTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(): Promise<CreateTaskUseCaseResponse> {
    const tasks = await this.tasksRepository.findAll();

    return { tasks };
  }
}
