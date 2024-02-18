import { CommentAttachment } from 'src/domain/enterprise/comment-attachment.entity';

export abstract class ICommentAttachmentsRepository {
  abstract findManyByCommentId(commentId: string): Promise<CommentAttachment[]>;
  abstract deleteManyByCommentId(commentId: string): Promise<void>;
}
