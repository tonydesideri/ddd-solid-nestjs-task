import {
  Attachment as PrismaAttachment,
  Comment as PrismaComment,
  Task as PrismaTask
} from '@prisma/client';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { TaskWithDetails } from 'src/modules/task/domain/enterprise/value-objects/task-with-details';
import { PrismaAttachmentMapper } from './prisma-attachment.mapper';


type PrismaTaskWithDetails = PrismaTask & {
  comments: (PrismaComment & {
    attachments: PrismaAttachment[];
  })[];
  attachments: PrismaAttachment[];
};

export class PrismaTaskWithDetailsMapper {
  static toDomain(raw: PrismaTaskWithDetails): TaskWithDetails {
    return TaskWithDetails.instance(
      {
        taskId: new UniqueEntityID(raw.id),
        title: raw.title,
        description: raw.description,
        status: raw.status,
        isFavotire: raw.isFavorite,
        createdAt: raw.createdAt,
        attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
        comments: raw.comments.map(comment => {
          return {
            attachments: comment.attachments.map(PrismaAttachmentMapper.toDomain),
            content: comment.content,
            createdAt: comment.createdAt
          }
        })

      },
    );
  }
}