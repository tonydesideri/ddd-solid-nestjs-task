import { TaskAttachment } from 'src/domain/enterprise/task-attachment.entity';

export interface ITaskAttachmentsRepository {
  findManyByTaskId(taskId: string): Promise<TaskAttachment[]>;
  deleteManyByTaskId(taskId: string): Promise<void>;
}
