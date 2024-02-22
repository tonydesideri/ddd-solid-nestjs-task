import { Either, success } from 'src/core/types/either';
import { TaskWithDetails } from 'src/domain/enterprise/value-objects/task-with-details';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface FetchTasksWithDetailsUseCaseRequest { }

type FetchTasksWithDetailsUseCaseResponse = Either<
  null,
  {
    tasks: TaskWithDetails[];
  }
>;

export class FetchTasksWithDetailsUseCase {
  constructor(private tasksRepository: ITasksRepository) { }

  async execute(): Promise<FetchTasksWithDetailsUseCaseResponse> {
    const tasks = await this.tasksRepository.findManyTasksWithDetails()

    return success({ tasks });
  }
}
