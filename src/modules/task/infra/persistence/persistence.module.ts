import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { ICommentAttachmentsRepository } from 'src/modules/task/domain/application/repositories/comment-attachments-repository.contract';
import { ITaskAttachmentsRepository } from 'src/modules/task/domain/application/repositories/task-attachments-repository.contract';
import { PrismaAttachmentsRepositoryImpl } from './prisma/repositories/prisma-attachment-repository.impl';
import { PrismaCommentAttachmentsRepositoryImpl } from './prisma/repositories/prisma-comment-attachments-repository.impl';
import { PrismaCommentsRepositoryImpl } from './prisma/repositories/prisma-comments-repository.impl';
import { PrismaTaskAttachmentsRepositoryImpl } from './prisma/repositories/prisma-task-attachments-repository.impl';
import { PrismaTasksRepositoryImpl } from './prisma/repositories/prisma-tasks-repository.impl';

@Module({
  imports: [DatabaseModule],
  providers: [
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
    ITaskAttachmentsRepository,
    ICommentAttachmentsRepository,
    PrismaTasksRepositoryImpl,
    PrismaTaskAttachmentsRepositoryImpl,
    PrismaCommentsRepositoryImpl,
    PrismaCommentAttachmentsRepositoryImpl,
    PrismaAttachmentsRepositoryImpl
  ],
})
export class PersistenceModule { }
