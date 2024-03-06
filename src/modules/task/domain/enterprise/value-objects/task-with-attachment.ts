import { UniqueEntityID } from "core/entities/unique-entity-id";
import { ValueObject } from "core/entities/value-object";
import { Attachment } from "../attachment.entity";

export interface TaskWithAttachmentProps {
  taskId: UniqueEntityID
  attachments: Attachment[]
  title: string;
  description: string;
  excerpt: string;
  isFavorite: boolean;
  status: 'DONE' | 'TODO' | 'DOING';
  createdAt: Date;
  updatedAt?: Date | null;
}

export class TaskWithAttachment extends ValueObject<TaskWithAttachmentProps> {
  static instance(props: TaskWithAttachmentProps) {
    return new TaskWithAttachment(props)
  }

  get taskId() {
    return this.props.taskId
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get excerpt() {
    return this.props.description.substring(0, 120).trimEnd().concat('...');
  }

  get isFavorite() {
    return this.props.isFavorite
  }

  get status() {
    return this.props.status
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
