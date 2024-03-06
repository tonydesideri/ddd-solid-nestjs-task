import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { Either, success } from 'core/types/either';
import { TaskAttachmentList } from 'src/modules/task/domain/enterprise/task-attachment-list.entity';
import { TaskAttachment } from 'src/modules/task/domain/enterprise/task-attachment.entity';
import { Task } from 'src/modules/task/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';

interface CreateTaskUseCaseRequest {
  title: string;
  description: string;
  attachmentsIds: string[];
}

type CreateTaskUseCaseResponse = Either<null, object>;

export class CreateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) { }

  async execute({
    title,
    description,
    attachmentsIds,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const task = Task.instance({
      title,
      description,
    });

    const attachments = attachmentsIds.map((item) => {
      return TaskAttachment.instance({
        attachmentId: new UniqueEntityID(item),
        taskId: task.id,
      });
    });

    task.attachments = new TaskAttachmentList(attachments);

    await this.tasksRepository.create(task);

    return success({});
  }
}
