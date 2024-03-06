import { ICommentAttachmentsRepository } from 'src/modules/task/domain/application/repositories/comment-attachments-repository.contract';
import { ICommentsRepository } from 'src/modules/task/domain/application/repositories/comments-repository.contract';
import { Comment } from 'src/modules/task/domain/enterprise/comment.entity';

export class InMemoryCommentsRepositoryImpl implements ICommentsRepository {
  public items: Comment[] = [];

  constructor(
    private commentAttachmentsRepository: ICommentAttachmentsRepository,
  ) { }

  async create(data: Comment): Promise<void> {
    this.items.push(data);

    await this.commentAttachmentsRepository.createMany(data.attachments.getItems())
  }

  async findById(commentId: string): Promise<Comment> {
    return this.items.find((item) => item.id.toString() === commentId) || null;
  }

  async save(data: Comment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      this.items[index] = data;

      await this.commentAttachmentsRepository.createMany(data.attachments.getNewItems())

      await this.commentAttachmentsRepository.deleteMany(data.attachments.getRemovedItems())
    }
  }

  async delete(commentId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === commentId);
    if (index !== -1) {
      this.items.splice(index, 1);
      await this.commentAttachmentsRepository.deleteManyByCommentId(commentId);
    }
  }
}
