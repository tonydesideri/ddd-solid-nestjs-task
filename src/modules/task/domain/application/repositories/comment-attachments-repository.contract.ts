import { CommentAttachment } from 'src/modules/task/domain/enterprise/comment-attachment.entity';

export abstract class ICommentAttachmentsRepository {
  abstract createMany(attachments: CommentAttachment[]): Promise<void>
  abstract deleteMany(attachments: CommentAttachment[]): Promise<void>
  abstract findManyByCommentId(commentId: string): Promise<CommentAttachment[]>;
  abstract deleteManyByCommentId(commentId: string): Promise<void>;
}
