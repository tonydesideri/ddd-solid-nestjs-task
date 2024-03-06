import { TaskAttachment } from 'src/modules/task/domain/enterprise/task-attachment.entity';

export abstract class ITaskAttachmentsRepository {
  abstract createMany(attachments: TaskAttachment[]): Promise<void>
  abstract deleteMany(attachments: TaskAttachment[]): Promise<void>
  abstract findManyByTaskId(taskId: string): Promise<TaskAttachment[]>;
  abstract deleteManyByTaskId(taskId: string): Promise<void>;
}
