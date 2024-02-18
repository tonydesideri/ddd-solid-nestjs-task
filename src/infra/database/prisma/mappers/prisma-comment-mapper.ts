import { Prisma, Comment as PrismaComment } from '@prisma/client';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Comment } from 'src/domain/enterprise/comment.entity';

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

  static toPrisma(task: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: task.id.toString(),
      content: task.content,
      taskId: task.id.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
