import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  CommentAttachment,
  CommentAttachmentProps,
} from 'src/domain/enterprise/comment-attachment.entity';

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
