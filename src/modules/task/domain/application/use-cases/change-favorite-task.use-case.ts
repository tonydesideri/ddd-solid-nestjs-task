import { Either, failure, success } from 'core/types/either';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
export interface ChangeFavoriteTaskUseCaseRequest {
  taskId: string;
}

export type ChangeFavoriteTaskUseCaseResponse = Either<ResourceNotFoundError, object>;

export class ChangeFavoriteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) { }

  async execute({
    taskId,
  }: ChangeFavoriteTaskUseCaseRequest): Promise<ChangeFavoriteTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      return failure(new ResourceNotFoundError('Tarefa não encontrada'));
    }

    task.isFavorite = !task.isFavorite;

    await this.tasksRepository.save(task);

    return success({});
  }
}
