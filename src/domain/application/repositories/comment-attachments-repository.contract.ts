import { CommentAttachment } from 'src/domain/enterprise/comment-attachment.entity';

export interface ICommentAttachmentsRepository {
  findManyByCommentId(commentId: string): Promise<CommentAttachment[]>;
  deleteManyByCommentId(commentId: string): Promise<void>;
}
