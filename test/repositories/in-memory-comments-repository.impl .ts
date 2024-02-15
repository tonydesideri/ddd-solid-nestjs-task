import { ICommentsRepository } from 'src/domain/application/repositories/comments-repository.contract';
import { Comment } from 'src/domain/enterprise/comment.entity';

export class InMemoryCommentsRepositoryImpl implements ICommentsRepository {
  public items: Comment[];

  async create(data: Comment): Promise<void> {
    this.items.push(data);
  }
}
