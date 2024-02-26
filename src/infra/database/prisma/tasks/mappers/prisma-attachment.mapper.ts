import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Attachment } from 'src/domain/tasks/enterprise/attachment.entity'


export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.instance(
      {
        title: raw.title,
        path: raw.path,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      path: attachment.path,
    }
  }
}