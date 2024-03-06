import { Entity } from 'core/entities/entity';
import { UniqueEntityID } from 'core/entities/unique-entity-id';

export interface CommentAttachmentProps {
  commentId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class CommentAttachment extends Entity<CommentAttachmentProps> {
  get commentId() {
    return this.props.commentId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static instance(props: CommentAttachmentProps, id?: UniqueEntityID) {
    const questionAttachment = new CommentAttachment(props, id);

    return questionAttachment;
  }
}
