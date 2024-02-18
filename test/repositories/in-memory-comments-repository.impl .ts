import { ICommentAttachmentsRepository } from 'src/domain/application/repositories/comment-attachments-repository.contract';
import { ICommentsRepository } from 'src/domain/application/repositories/comments-repository.contract';
import { Comment } from 'src/domain/enterprise/comment.entity';

export class InMemoryCommentsRepositoryImpl implements ICommentsRepository {
  public items: Comment[] = [];

  constructor(
    private commentAttachmentsRepository?: ICommentAttachmentsRepository,
  ) {}

  async create(data: Comment): Promise<void> {
    this.items.push(data);
  }

  async findById(id: string): Promise<Comment> {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async save(data: Comment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      this.items[index] = data;
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      await this.commentAttachmentsRepository.deleteManyByCommentId(id);
    }
  }
}