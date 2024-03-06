import { UniqueEntityID } from "core/entities/unique-entity-id";
import { ValueObject } from "core/entities/value-object";
import { Attachment } from "../attachment.entity";

export interface CommentWithDetailProps {
  content: string
  attachments: Attachment[]
  createdAt: Date
}
export interface TaskWithDetailsProps {
  taskId: UniqueEntityID
  title: string
  description: string
  isFavotire: boolean
  status: 'DONE' | 'TODO' | 'DOING';
  comments: CommentWithDetailProps[]
  attachments: Attachment[]
  createdAt: Date
}

export class TaskWithDetails extends ValueObject<TaskWithDetailsProps> {
  static instance(props: TaskWithDetailsProps) {
    return new TaskWithDetails(props)
  }

  get taskId() {
    return this.props.taskId
  }

  get title() {
    return this.props.title
  }

  get status() {
    return this.props.status
  }

  get description() {
    return this.props.description
  }

  get isFavorite() {
    return this.props.isFavotire
  }

  get comments() {
    return this.props.comments
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }
}