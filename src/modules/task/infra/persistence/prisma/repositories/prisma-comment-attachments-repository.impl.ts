import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { ICommentAttachmentsRepository } from 'src/modules/task/domain/application/repositories/comment-attachments-repository.contract';
import { CommentAttachment } from 'src/modules/task/domain/enterprise/comment-attachment.entity';
import { PrismaCommentAttachmentMapper } from '../mappers/prisma-comment-attachment.mapper';

@Injectable()
export class PrismaCommentAttachmentsRepositoryImpl
  implements ICommentAttachmentsRepository {
  constructor(
    private prisma: PrismaService
  ) { }

  async createMany(attachments: CommentAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentsIds = attachments.map((attachment) => attachment.attachmentId.toString())

    await this.prisma.attachment.updateMany({
      where: {
        id: {
          in: attachmentsIds
        }
      },
      data: {
        commentId: attachments[0].commentId.toString()
      }
    })
  }

  async deleteMany(attachments: CommentAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentsIds = attachments.map((attachment) => attachment.attachmentId.toString())

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds
        }
      },
    })
  }


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
