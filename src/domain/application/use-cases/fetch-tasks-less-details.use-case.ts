import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { Either, success } from 'src/core/types/either';
import { TaskLessDatailsProps } from 'src/domain/enterprise/value-objects/task-less-details';

interface FetchTasksLessDetailsUseCaseRequest { }

type FetchTasksLessDetailsUseCaseResponse = Either<
  null,
  {
    tasks: TaskLessDatailsProps[];
  }
>;

export class FetchTasksLessDetailsUseCase {
  constructor(private tasksRepository: ITasksRepository) { }

  async execute(): Promise<FetchTasksLessDetailsUseCaseResponse> {
    const tasks = await this.tasksRepository.findManyTasksLessDetails()

    return success({ tasks });
  }
}