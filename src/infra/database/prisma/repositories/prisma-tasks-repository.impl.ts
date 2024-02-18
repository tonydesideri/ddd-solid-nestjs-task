import { Injectable } from '@nestjs/common';
import { PaginationParams } from 'src/core/repositories/pagination-params.contract';
import { ITasksRepository } from 'src/domain/application/repositories/tasks-repository.contract';
import { Task } from 'src/domain/enterprise/task.entity';
import { PrismaService } from '../prisma.service';
import { PrismaTaskMapper } from '../mappers/prisma-task-mapper';

@Injectable()
export class PrismaTasksRepositoryImpl implements ITasksRepository {
  private PERPAGE = 20;
  constructor(private prisma: PrismaService) {}

  async create(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task);
    await this.prisma.task.create({
      data,
    });
  }

  async save(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task);
    await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findManyRecent({ page }: PaginationParams): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: this.PERPAGE,
      skip: (page - 1) * this.PERPAGE,
    });

    return tasks.map(PrismaTaskMapper.toDomain);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return null;
    }

    return PrismaTaskMapper.toDomain(task);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
