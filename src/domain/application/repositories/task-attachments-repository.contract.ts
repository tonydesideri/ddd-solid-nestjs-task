import { TaskAttachment } from 'src/domain/enterprise/task-attachment.entity';

export abstract class ITaskAttachmentsRepository {
  abstract findManyByTaskId(taskId: string): Promise<TaskAttachment[]>;
  abstract deleteManyByTaskId(taskId: string): Promise<void>;
}
