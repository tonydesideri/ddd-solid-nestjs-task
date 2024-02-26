import { ICommentAttachmentsRepository } from 'src/domain/tasks/application/repositories/comment-attachments-repository.contract';
import { CommentAttachment } from 'src/domain/tasks/enterprise/comment-attachment.entity';

export class InMemoryCommentAttachmentsRepositoryImpl
  implements ICommentAttachmentsRepository {
  public items: CommentAttachment[] = [];

  async findManyByCommentId(commentId: string): Promise<CommentAttachment[]> {
    return this.items.filter(
      (item) => item.attachmentId.toString() === commentId,
    );
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    const commentAttachments = this.items.filter(
      (item) => item.commentId.toString() !== commentId,
    );

    this.items = commentAttachments;
  }
}
