import { WatchedList } from 'src/core/entities/watched-list';
import { TaskAttachment } from './task-attachment.entity';

export class TaskAttachmentList extends WatchedList<TaskAttachment> {
  compareItems(a: TaskAttachment, b: TaskAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId);
  }
}
