import { Injectable } from '@nestjs/common'
import { IAttachmentsRepository } from 'src/domain/tasks/application/repositories/attachments-repository.contract'
import { Attachment } from 'src/domain/tasks/enterprise/attachment.entity'
import { PrismaService } from '../../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'


@Injectable()
export class PrismaAttachmentsRepositoryImpl implements IAttachmentsRepository {
  constructor(private prisma: PrismaService) { }

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}