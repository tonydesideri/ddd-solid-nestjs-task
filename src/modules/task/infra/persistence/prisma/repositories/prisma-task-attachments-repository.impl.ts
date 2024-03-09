import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { ITaskAttachmentsRepository } from 'src/modules/task/domain/application/repositories/task-attachments-repository.contract';
import { TaskAttachment } from 'src/modules/task/domain/enterprise/task-attachment.entity';
import { PrismaTaskAttachmentMapper } from '../mappers/prisma-task-attachment.mapper';

@Injectable()
export class PrismaTaskAttachmentsRepositoryImpl
  implements ITaskAttachmentsRepository {
  constructor(private prisma: PrismaService) { }

  async createMany(attachments: TaskAttachment[]): Promise<void> {
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
        taskId: attachments[0].taskId.toString()
      }
    })
  }

  async deleteMany(attachments: TaskAttachment[]): Promise<void> {
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

  async findManyByTaskId(taskId: string): Promise<TaskAttachment[]> {
    const taskAttachments = await this.prisma.attachment.findMany({
      where: {
        taskId
      }
    })

    return taskAttachments.map(PrismaTaskAttachmentMapper.toDomain)
  }

  async deleteManyByTaskId(taskId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        taskId
      }
    })
  }
}
