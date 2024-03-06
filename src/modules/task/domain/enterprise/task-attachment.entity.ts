import { Entity } from 'core/entities/entity';
import { UniqueEntityID } from 'core/entities/unique-entity-id';

export interface TaskAttachmentProps {
  taskId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class TaskAttachment extends Entity<TaskAttachmentProps> {
  get taskId() {
    return this.props.taskId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static instance(props: TaskAttachmentProps, id?: UniqueEntityID) {
    const questionAttachment = new TaskAttachment(props, id);

    return questionAttachment;
  }
}
