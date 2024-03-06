import { CommentWithDetailProps, TaskWithDetails } from 'src/modules/task/domain/enterprise/value-objects/task-with-details';
import { AttachmentPresenter } from './attachment.presenter';

export class TaskWithDetailsPresenter {
  static toHttpComment(comment: CommentWithDetailProps) {
    return {
      content: comment.content,
      createdAt: comment.createdAt,
      attachments: comment.attachments.map(AttachmentPresenter.toHTTP)
    }
  }

  static toHTTP(task: TaskWithDetails) {
    return {
      taskId: task.taskId.toString(),
      title: task.title,
      description: task.description,
      isFavorite: task.isFavorite,
      status: task.status,
      createdAt: task.createdAt,
      comments: task.comments.map(this.toHttpComment),
      attachments: task.attachments.map(AttachmentPresenter.toHTTP)
    };
  }
}
