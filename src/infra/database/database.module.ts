import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaTasksRepositoryImpl } from './prisma/repositories/prisma-tasks-repository.impl';
import { PrismaTaskAttachmentsRepositoryImpl } from './prisma/repositories/prisma-task-attachments-repository.impl';
import { PrismaCommentsRepositoryImpl } from './prisma/repositories/prisma-comments-repository.impl';
import { PrismaCommentAttachmentsRepositoryImpl } from './prisma/repositories/prisma-comment-attachments-repository.impl';

@Module({
  providers: [
    PrismaService,
    PrismaTasksRepositoryImpl,
    PrismaTaskAttachmentsRepositoryImpl,
    PrismaCommentsRepositoryImpl,
    PrismaCommentAttachmentsRepositoryImpl,
  ],
  exports: [
    PrismaService,
    PrismaTasksRepositoryImpl,
    PrismaTaskAttachmentsRepositoryImpl,
    PrismaCommentsRepositoryImpl,
    PrismaCommentAttachmentsRepositoryImpl,
  ],
})
export class DatabaseModule {}
