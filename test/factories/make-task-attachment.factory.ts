import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import {
  TaskAttachment,
  TaskAttachmentProps,
} from 'src/modules/task/domain/enterprise/task-attachment.entity';

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

@Injectable()
export class TaskAttachmentFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaTaskAttachment(data: Partial<TaskAttachmentProps> = {}) {
    const taskAttachment = makeTaskAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: taskAttachment.attachmentId.toString()
      },
      data: {
        taskId: taskAttachment.taskId.toString()
      }
    })

    return taskAttachment
  }
}