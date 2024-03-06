
import { TaskWithAttachment } from 'src/modules/task/domain/enterprise/value-objects/task-with-attachment';
import { AttachmentPresenter } from './attachment.presenter';

export class TaskWithAttachmentPresenter {
  static toHTTP(taskWithAttachment: TaskWithAttachment) {
    return {
      taskId: taskWithAttachment.taskId.toString(),
      title: taskWithAttachment.title,
      description: taskWithAttachment.description,
      excerpt: taskWithAttachment.excerpt,
      isFavorite: taskWithAttachment.isFavorite,
      status: taskWithAttachment.status,
      attachments: taskWithAttachment.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: taskWithAttachment.createdAt,
      updatedAt: taskWithAttachment.updatedAt,
    };
  }
}
