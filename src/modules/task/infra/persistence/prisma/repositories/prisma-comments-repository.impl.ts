import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { ICommentAttachmentsRepository } from 'src/modules/task/domain/application/repositories/comment-attachments-repository.contract';
import { ICommentsRepository } from 'src/modules/task/domain/application/repositories/comments-repository.contract';
import { Comment } from 'src/modules/task/domain/enterprise/comment.entity';
import { PrismaCommentMapper } from '../mappers/prisma-comment.mapper';

@Injectable()
export class PrismaCommentsRepositoryImpl implements ICommentsRepository {
  constructor(
    private prisma: PrismaService,
    private commentAttachmentsRepository: ICommentAttachmentsRepository,
  ) { }

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);
    await this.prisma.comment.create({
      data,
    });

    await this.commentAttachmentsRepository.createMany(
      comment.attachments.getItems()
    )
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment);

    await Promise.all([
      await this.prisma.comment.update({
        where: {
          id: data.id,
        },
        data,
      }),

      await this.commentAttachmentsRepository.createMany(
        comment.attachments.getItems()
      ),
      await this.commentAttachmentsRepository.deleteMany(
        comment.attachments.getRemovedItems()
      )
    ])
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
