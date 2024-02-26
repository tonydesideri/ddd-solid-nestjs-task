import { Injectable } from '@nestjs/common';
import { ICommentAttachmentsRepository } from 'src/domain/tasks/application/repositories/comment-attachments-repository.contract';
import { CommentAttachment } from 'src/domain/tasks/enterprise/comment-attachment.entity';
import { PrismaService } from '../../prisma.service';
import { PrismaCommentAttachmentMapper } from '../mappers/prisma-comment-attachment.mapper';

@Injectable()
export class PrismaCommentAttachmentsRepositoryImpl
  implements ICommentAttachmentsRepository {
  constructor(private prisma: PrismaService) { }

  async findManyByCommentId(commentId: string): Promise<CommentAttachment[]> {
    const commentAttachments = await this.prisma.attachment.findMany({
      where: {
        commentId
      }
    })

    return commentAttachments.map(PrismaCommentAttachmentMapper.toDomain)
  }

  async deleteManyByCommentId(commentId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        commentId
      }
    })
  }
}
