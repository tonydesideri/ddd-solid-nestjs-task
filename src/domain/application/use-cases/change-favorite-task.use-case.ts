import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface ChangeFavoriteTaskUseCaseRequest {
  id: string;
}

export class ChangeFavoriteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({ id }: ChangeFavoriteTaskUseCaseRequest): Promise<void> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new Error('Task not found.');
    }

    task.isFavorite = !task.isFavorite;

    await this.tasksRepository.save(task);
  }
}
