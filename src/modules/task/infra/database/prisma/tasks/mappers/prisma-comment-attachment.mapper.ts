import { Attachment as PrismaAttachment } from '@prisma/client';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { CommentAttachment } from 'src/modules/task/domain/enterprise/comment-attachment.entity';


export class PrismaCommentAttachmentMapper {
  static toDomain(raw: PrismaAttachment): CommentAttachment {
    if (!raw.commentId) {
      throw new Error("Ivalid attachment type.")
    }

    return CommentAttachment.instance(
      {
        attachmentId: new UniqueEntityID(raw.id),
        commentId: new UniqueEntityID(raw.commentId)
      },
      new UniqueEntityID(raw.id),
    );
  }
}
