import { Attachment as PrismaAttachment, Task as PrismaTask } from '@prisma/client';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { TaskWithAttachment } from 'src/modules/task/domain/enterprise/value-objects/task-with-attachment';
import { PrismaAttachmentMapper } from './prisma-attachment.mapper';

type PrismaTaskWithAttachment = PrismaTask & {
  attachments: PrismaAttachment[]
}

export class PrismaTaskWithAttachmentMapper {
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