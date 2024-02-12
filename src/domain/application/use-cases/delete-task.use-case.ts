import { Either, failure, success } from 'src/core/types/either';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface DeleteTaskUseCaseRequest {
  id: string;
}

type DeleteTaskUseCaseResponse = Either<ResourceNotFoundError, object>;

export class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    id,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      return failure(new ResourceNotFoundError('Tarefa não encontrada.'));
    }

    await this.tasksRepository.delete(id);

    return success({});
  }
}
