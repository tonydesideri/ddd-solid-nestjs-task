import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface CreateTaskUseCaseRequest {
  title: string;
  description: string;
}

export class CreateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    title,
    description,
  }: CreateTaskUseCaseRequest): Promise<void> {
    const task = Task.instance({
      title,
      description,
    });

    await this.tasksRepository.create(task);
  }
}
