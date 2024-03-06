import { Comment } from 'src/modules/task/domain/enterprise/comment.entity';

export interface ICommentsRepository {
  create(data: Comment): Promise<void>;
  save(data: Comment): Promise<void>
  findById(commentId: string): Promise<Comment | null>;
  delete(commentId: string): Promise<void>;
}
