import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  TaskAttachment,
  TaskAttachmentProps,
} from 'src/domain/enterprise/task-attachment.entity';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

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