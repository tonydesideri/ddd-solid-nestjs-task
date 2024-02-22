import { PaginationParams } from 'src/core/repositories/pagination-params.contract';
import { ITasksRepository } from 'src/domain/application/repositories/tasks-repository.contract';
import { Task } from 'src/domain/enterprise/task.entity';
import { TaskWithAttachment } from 'src/domain/enterprise/value-objects/task-with-attachment';
import { InMemoryTaskAttachmentsRepositoryImpl } from './in-memory-task-attachments-repository.impl ';
import { InMemoryAttachmentsRepositoryImpl } from './in-mamory-attachments-repository.impl';
import { TaskLessDetails } from 'src/domain/enterprise/value-objects/task-less-details';
import { InMemoryCommentsRepositoryImpl } from './in-memory-comments-repository.impl ';

const PERPAGE = 20;
export class InMemoryTasksRepositoryImpl implements ITasksRepository {
  public items: Task[];

  constructor(
    private taskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl,
    private attachmentRepository: InMemoryAttachmentsRepositoryImpl,
    private commentRepository: InMemoryCommentsRepositoryImpl
  ) {
    this.items = [];
  }

  async findManyTasksLessDetails(): Promise<TaskLessDetails[]> {
    const tasks = this.items
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())

    const tasksLessDetails = tasks.map(task => {
      const quantityAttachments =
        this.attachmentRepository.items.map(attachment => attachment.id.equals(task.id)).length

      const quantityComments =
        this.commentRepository.items.map(comment => comment.id.equals(task.id)).length

      return TaskLessDetails.instance({
        taskId: task.id,
        title: task.title,
        status: task.status,
        quantityAttachments,
        quantityComments,
        createdAt: task.createdAt
      })
    })

    return tasksLessDetails
  }

  async findManyRencentTasksWithAttachments({ page }: PaginationParams): Promise<TaskWithAttachment[]> {
    const tasks = this.items
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * PERPAGE, page * PERPAGE);


    const tasksWithAttachments = tasks.map(task => {
      const taskAttachments = this.taskAttachmentsRepository.items.filter(taskAttachment => {
        return taskAttachment.taskId.equals(task.id)
      })

      const attachments = taskAttachments.map(taskAttachment => {
        const attachment = this.attachmentRepository.items.find(attachment => {
          return attachment.id.equals(taskAttachment.attachmentId)
        })

        if (!attachment) {
          throw new Error(`Attachment with id ${attachment.id.toString()} does note exist.`)
        }

        return attachment
      })

      return TaskWithAttachment.instance({
        attachments,
        title: task.title,
        description: task.description,
        excerpt: task.excerpt,
        isFavorite: task.isFavorite,
        status: task.status,
        taskId: task.id,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      })
    })

    return tasksWithAttachments
  }

  async save(data: Task): Promise<void> {
    const index = this.items.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      this.items[index] = data;

      await this.taskAttachmentsRepository.createMany(data.attachments.getNewItems())

      await this.taskAttachmentsRepository.deleteMany(data.attachments.getRemovedItems())
    }
  }

  async create(data: Task): Promise<void> {
    this.items.push(data);

    await this.taskAttachmentsRepository.createMany(data.attachments.getItems())
  }

  async findManyRecent({ page }: PaginationParams): Promise<Task[]> {
    const items = this.items
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * PERPAGE, page * PERPAGE);

    return items;
  }

  async findById(id: string): Promise<Task | null> {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      await this.taskAttachmentsRepository.deleteManyByTaskId(id);
    }
  }
}
