import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface DeleteTaskUseCaseRequest {
  id: string;
}

export class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ id }: DeleteTaskUseCaseRequest): Promise<void> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new Error('Task not found.');
    }

    await this.tasksRepository.delete(id);
  }
}
