import { Comment } from 'src/domain/enterprise/comment.entity';

export interface ICommentsRepository {
  create(data: Comment): Promise<void>;
}
