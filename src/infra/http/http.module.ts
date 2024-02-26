import { Module } from '@nestjs/common';
import { ChangeFavoriteTaskUseCase } from 'src/domain/tasks/application/use-cases/change-favorite-task.use-case';
import { CreateTaskUseCase } from 'src/domain/tasks/application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from 'src/domain/tasks/application/use-cases/delete-task.use-case';
import { EditTaskUseCase } from 'src/domain/tasks/application/use-cases/edit-task.use-case';
import { FetchTasksUseCase } from 'src/domain/tasks/application/use-cases/fetch-tasks.use-case';
import { GetTaskWithDetailsUseCase } from 'src/domain/tasks/application/use-cases/get-task-with-details.use-case';
import { UploadAndCreateAttachmentUseCase } from 'src/domain/tasks/application/use-cases/upload-and-create-attachment.use-case';
import { DatabaseModule } from '../database/database.module';
import { PrismaAttachmentsRepositoryImpl } from '../database/prisma/tasks/repositories/prisma-attachment-repository.impl';
import { PrismaTaskAttachmentsRepositoryImpl } from '../database/prisma/tasks/repositories/prisma-task-attachments-repository.impl';
import { PrismaTasksRepositoryImpl } from '../database/prisma/tasks/repositories/prisma-tasks-repository.impl';
import { FileSystemStorageImpl } from '../storage/file-system-storage.impl';
import { StorageModule } from '../storage/storage.module';
import { UploadAttachmentController } from './attachments/controllers/upload-attachment.controller';
import { ChangeFavoriteTaskController } from './tasks/controllers/change-favorite-task.controller';
import { CreateTaskController } from './tasks/controllers/create-task.controller';
import { DeleteTaskController } from './tasks/controllers/delete-task.controller';
import { EditTaskController } from './tasks/controllers/edit-task.controller';
import { FetchRecentTasksController } from './tasks/controllers/fetch-recent-tasks.controller';
import { GetTaskWithDetailsController } from './tasks/controllers/get-task-with-details..controller';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    CreateTaskController,
    FetchRecentTasksController,
    EditTaskController,
    DeleteTaskController,
    ChangeFavoriteTaskController,
    UploadAttachmentController,
    GetTaskWithDetailsController
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
    {
      provide: GetTaskWithDetailsUseCase,
      useFactory: (repository: PrismaTasksRepositoryImpl) =>
        new GetTaskWithDetailsUseCase(repository),
      inject: [PrismaTasksRepositoryImpl],
    },
  ],
})
export class HttpModule { }
