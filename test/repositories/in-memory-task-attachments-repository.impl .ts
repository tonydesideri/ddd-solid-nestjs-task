import { ITaskAttachmentsRepository } from 'src/modules/task/domain/application/repositories/task-attachments-repository.contract';
import { TaskAttachment } from 'src/modules/task/domain/enterprise/task-attachment.entity';

export class InMemoryTaskAttachmentsRepositoryImpl
  implements ITaskAttachmentsRepository {
  public items: TaskAttachment[] = [];

  async createMany(attachments: TaskAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: TaskAttachment[]): Promise<void> {
    const taskAttachments = this.items.filter(
      (item) => {
        return !attachments.some((attachment) => attachment.equals(item))
      },
    );

    this.items = taskAttachments;
  }

  async findManyByTaskId(taskId: string): Promise<TaskAttachment[]> {
    return this.items.filter((item) => item.taskId.toString() === taskId);
  }

  async deleteManyByTaskId(taskId: string): Promise<void> {
    const taskAttachments = this.items.filter(
      (item) => item.taskId.toString() !== taskId,
    );

    this.items = taskAttachments;
  }
}
