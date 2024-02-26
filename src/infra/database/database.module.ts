import { Module } from '@nestjs/common';
import { ITaskAttachmentsRepository } from 'src/domain/tasks/application/repositories/task-attachments-repository.contract';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAttachmentsRepositoryImpl } from './prisma/tasks/repositories/prisma-attachment-repository.impl';
import { PrismaCommentAttachmentsRepositoryImpl } from './prisma/tasks/repositories/prisma-comment-attachments-repository.impl';
import { PrismaCommentsRepositoryImpl } from './prisma/tasks/repositories/prisma-comments-repository.impl';
import { PrismaTaskAttachmentsRepositoryImpl } from './prisma/tasks/repositories/prisma-task-attachments-repository.impl';
import { PrismaTasksRepositoryImpl } from './prisma/tasks/repositories/prisma-tasks-repository.impl';

@Module({
  providers: [
    PrismaService,
    PrismaTasksRepositoryImpl,
    PrismaTaskAttachmentsRepositoryImpl,
    PrismaCommentsRepositoryImpl,
    PrismaCommentAttachmentsRepositoryImpl,
    PrismaAttachmentsRepositoryImpl,
    {
      provide: ITaskAttachmentsRepository,
      useClass: PrismaTaskAttachmentsRepositoryImpl
    }
  ],
  exports: [
    PrismaService,
    PrismaTasksRepositoryImpl,
    PrismaTaskAttachmentsRepositoryImpl,
    ITaskAttachmentsRepository,
    PrismaCommentsRepositoryImpl,
    PrismaCommentAttachmentsRepositoryImpl,
    PrismaAttachmentsRepositoryImpl
  ],
})
export class DatabaseModule { }
