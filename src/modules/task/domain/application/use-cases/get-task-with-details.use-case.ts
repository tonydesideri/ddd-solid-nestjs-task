import { Either, failure, success } from 'core/types/either';
import { TaskWithDetails } from 'src/modules/task/domain/enterprise/value-objects/task-with-details';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetTasksWithDetailsUseCaseRequest {
  taskId: string
}

type GetTasksWithDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    task: TaskWithDetails;
  }
>;

export class GetTaskWithDetailsUseCase {
  constructor(private tasksRepository: ITasksRepository) { }

  async execute({ taskId }: GetTasksWithDetailsUseCaseRequest): Promise<GetTasksWithDetailsUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      return failure(new ResourceNotFoundError("Tarefa não encontrada"))
    }

    const taskWithDetails = await this.tasksRepository.findByTaskIdWithDetails(taskId)

    return success({ task: taskWithDetails });
  }
}
