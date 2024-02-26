import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Comment, CommentProps } from 'src/domain/tasks/enterprise/comment.entity';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { PrismaCommentMapper } from 'src/infra/database/prisma/tasks/mappers/prisma-comment.mapper';

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = Comment.instance(
    {
      content: faker.lorem.sentence({ min: 10, max: 50 }),
      taskId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return comment;
}


@Injectable()
export class CommentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaComment(data: Partial<CommentProps> = {}) {
    const comment = makeComment(data)

    await this.prisma.comment.create({
      data: PrismaCommentMapper.toPrisma(comment)
    })

    return comment
  }
}