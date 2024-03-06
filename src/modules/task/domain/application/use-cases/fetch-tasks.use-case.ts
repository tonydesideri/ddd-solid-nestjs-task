import { Either, success } from 'core/types/either';
import { TaskWithAttachment } from 'src/modules/task/domain/enterprise/value-objects/task-with-attachment';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

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
