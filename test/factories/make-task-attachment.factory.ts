import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  TaskAttachment,
  TaskAttachmentProps,
} from 'src/domain/enterprise/task-attachment.entity';

export function makeTaskAttachment(
  override: Partial<TaskAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const task = TaskAttachment.instance(
    {
      attachmentId: new UniqueEntityID(),
      taskId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return task;
}
