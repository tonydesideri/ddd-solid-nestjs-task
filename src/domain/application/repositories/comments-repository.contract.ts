import { Comment } from 'src/domain/enterprise/comment.entity';

export interface ICommentsRepository {
  create(data: Comment): Promise<void>;
  save(data: Comment): Promise<void>
  findById(id: string): Promise<Comment | null>;
  delete(id: string): Promise<void>;
}
