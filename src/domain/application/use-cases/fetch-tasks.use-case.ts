import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { Either, success } from 'src/core/types/either';

interface FetchTasksUseCaseRequest {
  page: number;
}

type FetchTasksUseCaseResponse = Either<
  null,
  {
    tasks: Task[];
  }
>;

export class FetchTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    page,
  }: FetchTasksUseCaseRequest): Promise<FetchTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.findManyRecent({ page });

    return success({ tasks });
  }
}
