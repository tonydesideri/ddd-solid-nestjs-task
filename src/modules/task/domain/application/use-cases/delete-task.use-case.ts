import { Either, failure, success } from 'core/types/either';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface DeleteTaskUseCaseRequest {
  taskId: string;
}

type DeleteTaskUseCaseResponse = Either<ResourceNotFoundError, object>;

export class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) { }

  async execute({
    taskId,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      return failure(new ResourceNotFoundError('Tarefa não encontrada.'));
    }

    await this.tasksRepository.delete(taskId);

    return success({});
  }
}
