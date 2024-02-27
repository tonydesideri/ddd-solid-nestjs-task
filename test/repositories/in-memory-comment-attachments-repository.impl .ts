import { ICommentAttachmentsRepository } from 'src/domain/tasks/application/repositories/comment-attachments-repository.contract';
import { CommentAttachment } from 'src/domain/tasks/enterprise/comment-attachment.entity';

export class InMemoryCommentAttachmentsRepositoryImpl
  implements ICommentAttachmentsRepository {
  public items: CommentAttachment[] = [];

  async createMany(attachments: CommentAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: CommentAttachment[]): Promise<void> {
    const commentAttachments = this.items.filter(
      (item) => {
        return !attachments.some((attachment) => attachment.equals(item))
      },
    );

    this.items = commentAttachments;
  }

  async findManyByCommentId(commentId: string): Promise<CommentAttachment[]> {
    return this.items.filter(
      (item) => item.commentId.toString() === commentId,
    );
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    const commentAttachments = this.items.filter(
      (item) => item.commentId.toString() !== commentId,
    );

    this.items = commentAttachments;
  }
}
