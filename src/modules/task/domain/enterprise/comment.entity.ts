import { Entity } from 'core/entities/entity';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { Optional } from 'core/types/optional';
import { CommentAttachmentList } from './comment-attachment-list.entity';

export interface CommentProps {
  taskId: UniqueEntityID;
  content: string;
  attachments: CommentAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Comment extends Entity<CommentProps> {
  static instance(
    props: Optional<CommentProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const commnent = new Comment(
      {
        ...props,
        attachments: props.attachments || new CommentAttachmentList(),
        createdAt: props.createdAt || new Date(),
      },
      id,
    );

    return commnent;
  }

  get taskId() {
    return this.props.taskId;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get attachments() {
    return this.props.attachments;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  set attachments(value: CommentAttachmentList) {
    this.props.attachments = value;
    this.touch();
  }
}
