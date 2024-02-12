import { Task } from 'src/domain/enterprise/task.entity';
import { ITasksRepository } from '../repositories/tasks-repository.contract';
import { Either, failure, success } from 'src/core/types/either';
import { TaskAttachment } from 'src/domain/enterprise/task-attachment.entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { TaskAttachmentList } from 'src/domain/enterprise/task-attachment-list.entity';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ITaskAttachmentsRepository } from '../repositories/task-attachments-repository.contract';

interface EditTaskUseCaseRequest {
  taskId: string;
  title: string;
  description: string;
  attachmentsIds: string[];
}

type EditTaskUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    task: Task;
  }
>;

export class EditTaskUseCase {
  constructor(
    private tasksRepository: ITasksRepository,
    private taskAttachmentsRepository: ITaskAttachmentsRepository,
  ) {}

  async execute({
    taskId,
    title,
    description,
    attachmentsIds,
  }: EditTaskUseCaseRequest): Promise<EditTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId);

    if (!task) {
      return failure(new ResourceNotFoundError('Tarefa não encontrada.'));
    }

    const currentTaskAttachments =
      await this.taskAttachmentsRepository.findManyByTaskId(taskId);

    const taskAttachmentList = new TaskAttachmentList(currentTaskAttachments);

    const taskAttachments = attachmentsIds.map((attachmentId) => {
      return TaskAttachment.instance({
        attachmentId: new UniqueEntityID(attachmentId),
        taskId: task.id,
      });
    });

    taskAttachmentList.update(taskAttachments);

    task.attachments = taskAttachmentList;
    task.title = title;
    task.description = description;

    await this.tasksRepository.save(task);

    return success({ task });
  }
}
