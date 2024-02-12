import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { Either, success } from 'src/core/types/either';

interface CreateTaskUseCaseRequest {
  title: string;
  description: string;
}

type CreateTaskUseCaseResponse = Either<null, object>;

export class CreateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    title,
    description,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const task = Task.instance({
      title,
      description,
    });

    await this.tasksRepository.create(task);

    return success({});
  }
}
