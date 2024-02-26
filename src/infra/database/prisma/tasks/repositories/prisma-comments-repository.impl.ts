import { Injectable } from '@nestjs/common';
import { ICommentsRepository } from 'src/domain/tasks/application/repositories/comments-repository.contract';
import { Comment } from 'src/domain/tasks/enterprise/comment.entity';
import { PrismaService } from '../../prisma.service';
import { PrismaCommentMapper } from '../mappers/prisma-comment.mapper';

@Injectable()
export class PrismaCommentsRepositoryImpl implements ICommentsRepository {
  constructor(private prisma: PrismaService) { }

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);
    await this.prisma.comment.create({
      data,
    });
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);
    await this.prisma.comment.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      return null;
    }

    return PrismaCommentMapper.toDomain(comment);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }
}
