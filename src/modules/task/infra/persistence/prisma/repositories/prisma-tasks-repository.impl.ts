import { Injectable } from '@nestjs/common';
import { DomainEvents } from 'core/events/domain-events';
import { PaginationParams } from 'core/repositories/pagination-params.contract';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { ITaskAttachmentsRepository } from 'src/modules/task/domain/application/repositories/task-attachments-repository.contract';
import { ITasksRepository } from 'src/modules/task/domain/application/repositories/tasks-repository.contract';
import { Task } from 'src/modules/task/domain/enterprise/task.entity';
import { TaskLessDetails } from 'src/modules/task/domain/enterprise/value-objects/task-less-details';
import { TaskWithAttachment } from 'src/modules/task/domain/enterprise/value-objects/task-with-attachment';
import { TaskWithDetails } from 'src/modules/task/domain/enterprise/value-objects/task-with-details';
import { PrismaTaskLessDetailsMapper } from '../mappers/prisma-task-less-details.mapper';
import { PrismaTaskWithAttachmentMapper } from '../mappers/prisma-task-with-attachment.mapper';
import { PrismaTaskWithDetailsMapper } from '../mappers/prisma-task-with-details.mapper';
import { PrismaTaskMapper } from '../mappers/prisma-task.mapper';

@Injectable()
export class PrismaTasksRepositoryImpl implements ITasksRepository {
  private PERPAGE = 20;
  constructor(
    private prisma: PrismaService,
    private taskAttachmentsRepository: ITaskAttachmentsRepository,
  ) { }

  async findManyTasksLessDetails(): Promise<TaskLessDetails[]> {
    const tasks = await this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        _count: {
          select: {
            attachments: true,
            comments: true
          }
        }
      }
    });

    return tasks.map(PrismaTaskLessDetailsMapper.toDomain)
  }

  async findByTaskIdWithDetails(taskId: string): Promise<TaskWithDetails> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId
      },
      include: {
        attachments: true,
        comments: {
          include: {
            attachments: true
          }
        },
      }
    })

    return PrismaTaskWithDetailsMapper.toDomain(task)
  }

  async create(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task);
    await this.prisma.task.create({
      data,
    });

    await this.taskAttachmentsRepository.createMany(
      task.attachments.getItems()
    )
  }

  async save(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task);

    await Promise.all([
      await this.prisma.task.update({
        where: {
          id: data.id,
        },
        data,
      }),
      await this.taskAttachmentsRepository.createMany(
        task.attachments.getItems()
      ),
      await this.taskAttachmentsRepository.deleteMany(
        task.attachments.getRemovedItems()
      )
    ])

    DomainEvents.dispatchEventsForAggregate(task.id)
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

  async findManyRencentTasksWithAttachments({ page }: PaginationParams): Promise<TaskWithAttachment[]> {
    const tasks = await this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        attachments: true
      },
      take: this.PERPAGE,
      skip: (page - 1) * this.PERPAGE,
    });

    return tasks.map(PrismaTaskWithAttachmentMapper.toDomain);
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
