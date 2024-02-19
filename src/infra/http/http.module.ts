import { Module } from '@nestjs/common';
import { CreateTaskController } from './tasks/controllers/create-task.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateTaskUseCase } from 'src/domain/application/use-cases/create-task.use-case';
import { PrismaTasksRepositoryImpl } from '../database/prisma/repositories/prisma-tasks-repository.impl';
import { FetchTasksUseCase } from 'src/domain/application/use-cases/fetch-tasks.use-case';
import { FetchRecentTasksController } from './tasks/controllers/fetch-recent-tasks.controller';
import { EditTaskController } from './tasks/controllers/edit-task.controller';
import { EditTaskUseCase } from 'src/domain/application/use-cases/edit-task.use-case';
import { PrismaTaskAttachmentsRepositoryImpl } from '../database/prisma/repositories/prisma-task-attachments-repository.impl';
import { DeleteTaskController } from './tasks/controllers/delete-task.controller';
import { DeleteTaskUseCase } from 'src/domain/application/use-cases/delete-task.use-case';
import { ChangeFavoriteTaskUseCase } from 'src/domain/application/use-cases/change-favorite-task.use-case';
import { ChangeFavoriteTaskController } from './tasks/controllers/change-favorite-task.controller';
import { UploadAttachmentController } from './attachments/upload-attachment.controller';
import { StorageModule } from '../storage/storage.module';
import { UploadAndCreateAttachmentUseCase } from 'src/domain/application/use-cases/upload-and-create-attachment.use-case';
import { FileSystemStorageImpl } from '../storage/local-storage.impl';
import { PrismaAttachmentsRepositoryImpl } from '../database/prisma/repositories/prisma-attachment-repository.impl';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CreateTaskController,
    FetchRecentTasksController,
    EditTaskController,
    DeleteTaskController,
    ChangeFavoriteTaskController,
    UploadAttachmentController
  ],
  providers: [
    {
      provide: CreateTaskUseCase,
      useFactory: (repository: PrismaTasksRepositoryImpl) =>
        new CreateTaskUseCase(repository),
      inject: [PrismaTasksRepositoryImpl],
    },
    {
      provide: FetchTasksUseCase,
      useFactory: (repository: PrismaTasksRepositoryImpl) =>
        new FetchTasksUseCase(repository),
      inject: [PrismaTasksRepositoryImpl],
    },
    {
      provide: EditTaskUseCase,
      useFactory: (
        tasksRepository: PrismaTasksRepositoryImpl,
        taskAttachmentsRepository: PrismaTaskAttachmentsRepositoryImpl
      ) =>
        new EditTaskUseCase(tasksRepository, taskAttachmentsRepository),
      inject: [PrismaTasksRepositoryImpl, PrismaTaskAttachmentsRepositoryImpl],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (repository: PrismaTasksRepositoryImpl) =>
        new DeleteTaskUseCase(repository),
      inject: [PrismaTasksRepositoryImpl],
    },
    {
      provide: ChangeFavoriteTaskUseCase,
      useFactory: (repository: PrismaTasksRepositoryImpl) =>
        new ChangeFavoriteTaskUseCase(repository),
      inject: [PrismaTasksRepositoryImpl],
    },
    {
      provide: UploadAndCreateAttachmentUseCase,
      useFactory: (repository: PrismaAttachmentsRepositoryImpl, storage: FileSystemStorageImpl) =>
        new UploadAndCreateAttachmentUseCase(repository, storage),
      inject: [PrismaAttachmentsRepositoryImpl, FileSystemStorageImpl],
    },
  ],
})
export class HttpModule { }
