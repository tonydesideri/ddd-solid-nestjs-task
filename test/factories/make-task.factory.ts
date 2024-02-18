import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Task, TaskProps } from 'src/domain/enterprise/task.entity';
import { PrismaTaskMapper } from 'src/infra/database/prisma/mappers/prisma-task-mapper';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueEntityID,
) {
  const task = Task.instance(
    {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence({ min: 10, max: 50 }),
      isFavorite: false,
      status: 'TODO',
      ...override,
    },
    id,
  );

  return task;
}

@Injectable()
export class TaskFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaTask(data: Partial<TaskProps> = {}) {
    const task = makeTask(data)

    await this.prisma.task.create({
      data: PrismaTaskMapper.toPrisma(task)
    })

    return task
  }
}