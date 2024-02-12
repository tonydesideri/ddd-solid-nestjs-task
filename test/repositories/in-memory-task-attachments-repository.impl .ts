import { ITaskAttachmentsRepository } from 'src/domain/application/repositories/task-attachments-repository.contract';
import { TaskAttachment } from 'src/domain/enterprise/task-attachment.entity';

export class InMemoryTaskAttachmentsRepositoryImpl
  implements ITaskAttachmentsRepository
{
  public items: TaskAttachment[] = [];

  async findManyByTaskId(taskId: string): Promise<TaskAttachment[]> {
    return this.items.filter((item) => item.attachmentId.toString() === taskId);
  }

  async deleteManyByTaskId(taskId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
