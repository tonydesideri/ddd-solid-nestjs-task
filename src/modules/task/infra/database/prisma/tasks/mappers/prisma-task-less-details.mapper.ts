import { $Enums } from '@prisma/client';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { TaskLessDetails } from 'src/modules/task/domain/enterprise/value-objects/task-less-details';


type PrismaTaskLessDetails = {
  id: string;
  title: string;
  status: $Enums.TaskStatus;
  createdAt: Date;
  _count: {
    attachments: number;
    comments: number;
  };
}

export class PrismaTaskLessDetailsMapper {
  static toDomain(raw: PrismaTaskLessDetails): TaskLessDetails {
    return TaskLessDetails.instance(
      {
        title: raw.title,
        status: raw.status,
        createdAt: raw.createdAt,
        taskId: new UniqueEntityID(raw.id),
        quantityAttachments: raw._count.attachments,
        quantityComments: raw._count.comments
      },
    );
  }
}