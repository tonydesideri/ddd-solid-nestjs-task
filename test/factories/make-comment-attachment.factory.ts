import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  CommentAttachment,
  CommentAttachmentProps,
} from 'src/domain/tasks/enterprise/comment-attachment.entity';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

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
