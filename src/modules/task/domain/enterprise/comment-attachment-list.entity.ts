import { WatchedList } from 'core/entities/watched-list';
import { CommentAttachment } from './comment-attachment.entity';

export class CommentAttachmentList extends WatchedList<CommentAttachment> {
  compareItems(a: CommentAttachment, b: CommentAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId);
  }
}
