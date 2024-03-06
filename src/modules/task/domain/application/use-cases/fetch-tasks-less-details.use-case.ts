import { Either, success } from 'core/types/either';
import { TaskLessDatailsProps } from 'src/modules/task/domain/enterprise/value-objects/task-less-details';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

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
