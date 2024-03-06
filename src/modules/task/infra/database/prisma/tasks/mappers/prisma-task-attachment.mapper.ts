import { Attachment as PrismaAttachment } from '@prisma/client';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { TaskAttachment } from 'src/modules/task/domain/enterprise/task-attachment.entity';


export class PrismaTaskAttachmentMapper {
  static toDomain(raw: PrismaAttachment): TaskAttachment {
    if (!raw.taskId) {
      throw new Error("Ivalid attachment type.")
    }

    return TaskAttachment.instance(
      {
        attachmentId: new UniqueEntityID(raw.id),
        taskId: new UniqueEntityID(raw.taskId)
      },
      new UniqueEntityID(raw.id),
    );
  }
}
