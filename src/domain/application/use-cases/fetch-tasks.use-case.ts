import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { Either, success } from 'src/core/types/either';
import { TaskWithAttachment } from 'src/domain/enterprise/value-objects/task-with-attachment';

interface FetchTasksUseCaseRequest {
  page: number;
}

type FetchTasksUseCaseResponse = Either<
  null,
  {
    tasks: TaskWithAttachment[];
  }
>;

export class FetchTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) { }

  async execute({
    page,
  }: FetchTasksUseCaseRequest): Promise<FetchTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.findManyRencentTasksWithAttachments({ page });

    return success({ tasks });
  }
}
