import { Task as PrismaTask, Attachment as PrismaAttachment } from '@prisma/client'
import { TaskWithAttachment } from 'src/domain/enterprise/value-objects/task-with-attachment';
import { PrismaAttachmentMapper } from './prisma-attachment-mapper';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

type PrismaTaskWithAttachment = PrismaTask & {
  attachments: PrismaAttachment[]
}

export class PrismaTaskWithMapper {
  static toDomain(raw: PrismaTaskWithAttachment): TaskWithAttachment {
    return TaskWithAttachment.instance(
      {
        taskId: new UniqueEntityID(raw.id),
        title: raw.title,
        description: raw.description,
        excerpt: raw.description,
        isFavorite: raw.isFavorite,
        status: raw.status,
        attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
    );
  }
}