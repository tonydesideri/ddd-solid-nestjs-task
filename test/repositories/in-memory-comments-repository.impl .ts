import { ICommentsRepository } from 'src/domain/application/repositories/comments-repository.contract';
import { Comment } from 'src/domain/enterprise/comment.entity';

export class InMemoryCommentsRepositoryImpl implements ICommentsRepository {
  public items: Comment[] = [];

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
}
