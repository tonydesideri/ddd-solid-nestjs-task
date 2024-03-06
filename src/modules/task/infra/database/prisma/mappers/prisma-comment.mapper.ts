import { Prisma, Comment as PrismaComment } from '@prisma/client';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { Comment } from 'src/modules/task/domain/enterprise/comment.entity';

export class PrismaCommentMapper {
  static toDomain(raw: PrismaComment): Comment {
    return Comment.instance(
      {
        content: raw.content,
        taskId: new UniqueEntityID(raw.taskId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,

      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(comment: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      taskId: comment.taskId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
