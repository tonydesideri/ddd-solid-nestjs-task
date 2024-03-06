import { UniqueEntityID } from "core/entities/unique-entity-id";
import { ValueObject } from "core/entities/value-object";

export interface TaskLessDatailsProps {
  taskId: UniqueEntityID
  title: string
  status: 'DONE' | 'TODO' | 'DOING';
  quantityComments: number
  quantityAttachments: number
  createdAt: Date
}

export class TaskLessDetails extends ValueObject<TaskLessDatailsProps> {
  static instance(props: TaskLessDatailsProps) {
    return new TaskLessDetails(props)
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

  get quantityComments() {
    return this.props.quantityComments
  }

  get quantityAttachments() {
    return this.props.quantityAttachments
  }

  get createdAt() {
    return this.props.createdAt
  }
}