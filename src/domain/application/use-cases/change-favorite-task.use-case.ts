import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { Either, failure, success } from 'src/core/types/either';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
interface ChangeFavoriteTaskUseCaseRequest {
  taskId: string;
}

type ChangeFavoriteTaskUseCaseResponse = Either<ResourceNotFoundError, object>;

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
