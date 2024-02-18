import { Injectable } from '@nestjs/common';
import { ITaskAttachmentsRepository } from 'src/domain/application/repositories/task-attachments-repository.contract';
import { TaskAttachment } from 'src/domain/enterprise/task-attachment.entity';
import { PrismaService } from '../prisma.service';
import { PrismaTaskAttachmentMapper } from '../mappers/prisma-task-attachment-mapper';

@Injectable()
export class PrismaTaskAttachmentsRepositoryImpl
  implements ITaskAttachmentsRepository {
  constructor(private prisma: PrismaService) { }

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
