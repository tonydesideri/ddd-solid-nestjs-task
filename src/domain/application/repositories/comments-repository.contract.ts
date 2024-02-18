import { Comment } from 'src/domain/enterprise/comment.entity';

export abstract class ICommentsRepository {
  abstract create(data: Comment): Promise<void>;
  abstract save(data: Comment): Promise<void>;
  abstract findById(id: string): Promise<Comment | null>;
  abstract delete(id: string): Promise<void>;
}
