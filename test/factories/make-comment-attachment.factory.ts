import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import {
  CommentAttachment,
  CommentAttachmentProps,
} from 'src/modules/task/domain/enterprise/comment-attachment.entity';

export function makeCommentAttachment(
  override: Partial<CommentAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = CommentAttachment.instance(
    {
      attachmentId: new UniqueEntityID(),
      commentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return comment;
}

@Injectable()
export class CommentAttachmentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaCommentAttachment(data: Partial<CommentAttachmentProps> = {}) {
    const commentAttachment = makeCommentAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: commentAttachment.attachmentId.toString()
      },
      data: {
        commentId: commentAttachment.commentId.toString()
      }
    })

    return commentAttachment
  }
}
