import { Module } from '@nestjs/common';
import { ICommentAttachmentsRepository } from 'src/modules/task/domain/application/repositories/comment-attachments-repository.contract';
import { ITaskAttachmentsRepository } from 'src/modules/task/domain/application/repositories/task-attachments-repository.contract';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAttachmentsRepositoryImpl } from './prisma/repositories/prisma-attachment-repository.impl';
import { PrismaCommentAttachmentsRepositoryImpl } from './prisma/repositories/prisma-comment-attachments-repository.impl';
import { PrismaCommentsRepositoryImpl } from './prisma/repositories/prisma-comments-repository.impl';
import { PrismaTaskAttachmentsRepositoryImpl } from './prisma/repositories/prisma-task-attachments-repository.impl';
import { PrismaTasksRepositoryImpl } from './prisma/repositories/prisma-tasks-repository.impl';

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
    },
    {
      provide: ICommentAttachmentsRepository,
      useClass: PrismaCommentAttachmentsRepositoryImpl
    }
  ],
  exports: [
    PrismaService,
    ITaskAttachmentsRepository,
    ICommentAttachmentsRepository,
    PrismaTasksRepositoryImpl,
    PrismaTaskAttachmentsRepositoryImpl,
    PrismaCommentsRepositoryImpl,
    PrismaCommentAttachmentsRepositoryImpl,
    PrismaAttachmentsRepositoryImpl
  ],
})
export class DatabaseModule { }
