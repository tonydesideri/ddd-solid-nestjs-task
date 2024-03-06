import { Prisma, Task as PrismaTask } from '@prisma/client';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { Task } from 'src/modules/task/domain/enterprise/task.entity';

export class PrismaTaskMapper {
  static toDomain(raw: PrismaTask): Task {
    return Task.instance(
      {
        title: raw.title,
        description: raw.description,
        isFavorite: raw.isFavorite,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(task: Task): Prisma.TaskUncheckedCreateInput {
    return {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      isFavorite: task.isFavorite,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
