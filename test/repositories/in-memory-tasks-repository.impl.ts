import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { DomainEvents } from 'core/events/domain-events';
import { PaginationParams } from 'core/repositories/pagination-params.contract';
import { ITasksRepository } from 'src/modules/task/domain/application/repositories/tasks-repository.contract';
import { Task } from 'src/modules/task/domain/enterprise/task.entity';
import { TaskLessDetails } from 'src/modules/task/domain/enterprise/value-objects/task-less-details';
import { TaskWithAttachment } from 'src/modules/task/domain/enterprise/value-objects/task-with-attachment';
import { TaskWithDetails } from 'src/modules/task/domain/enterprise/value-objects/task-with-details';
import { InMemoryAttachmentsRepositoryImpl } from './in-mamory-attachments-repository.impl';
import { InMemoryCommentAttachmentsRepositoryImpl } from './in-memory-comment-attachments-repository.impl ';
import { InMemoryCommentsRepositoryImpl } from './in-memory-comments-repository.impl ';
import { InMemoryTaskAttachmentsRepositoryImpl } from './in-memory-task-attachments-repository.impl ';

const PERPAGE = 20;
export class InMemoryTasksRepositoryImpl implements ITasksRepository {
  public items: Task[];

  constructor(
    private taskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl,
    private attachmentRepository: InMemoryAttachmentsRepositoryImpl,
    private commentRepository: InMemoryCommentsRepositoryImpl,
    private commentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl
  ) {
    this.items = [];
  }

  async findByTaskIdWithDetails(taskId: string): Promise<TaskWithDetails> {
    const task = this.items.find(task => task.id.equals(new UniqueEntityID(taskId)))

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

    const comments = this.commentRepository.items.filter(comment => comment.taskId.equals(task.id))

    const commentsWithAttachments = comments.map(comment => {
      const commentAttachments = this.commentAttachmentsRepository.items.filter(commentAttachment => {
        return commentAttachment.commentId.equals(comment.id)
      })

      const attachments = commentAttachments.map(commentAttachment => {
        const attachment = this.attachmentRepository.items.find(attachment => {
          return attachment.id.equals(commentAttachment.attachmentId)
        })

        if (!attachment) {
          throw new Error(`Attachment with id ${attachment.id.toString()} does note exist.`)
        }

        return attachment
      })

      return {
        content: comment.content,
        attachments,
        createdAt: comment.createdAt
      }
    })

    return TaskWithDetails.instance({
      taskId: task.id,
      title: task.title,
      description: task.description,
      isFavotire: task.isFavorite,
      status: task.status,
      createdAt: task.createdAt,
      attachments,
      comments: commentsWithAttachments
    })
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

      DomainEvents.dispatchEventsForAggregate(data.id)
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
