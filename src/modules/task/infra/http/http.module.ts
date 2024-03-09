import { Module } from '@nestjs/common';
import { ChangeFavoriteTaskUseCase } from '../../domain/application/use-cases/change-favorite-task.use-case';
import { CreateCommentUseCase } from '../../domain/application/use-cases/create-comment.use-case';
import { CreateTaskUseCase } from '../../domain/application/use-cases/create-task.use-case';
import { DeleteCommentUseCase } from '../../domain/application/use-cases/delete-comment.use-case';
import { DeleteTaskUseCase } from '../../domain/application/use-cases/delete-task.use-case';
import { EditCommentUseCase } from '../../domain/application/use-cases/edit-comment.use-case';
import { EditTaskUseCase } from '../../domain/application/use-cases/edit-task.use-case';
import { FetchTasksUseCase } from '../../domain/application/use-cases/fetch-tasks.use-case';
import { GetTaskWithDetailsUseCase } from '../../domain/application/use-cases/get-task-with-details.use-case';
import { UploadAndCreateAttachmentUseCase } from '../../domain/application/use-cases/upload-and-create-attachment.use-case';
import { PersistenceModule } from '../persistence/persistence.module';
import { PrismaAttachmentsRepositoryImpl } from '../persistence/prisma/repositories/prisma-attachment-repository.impl';
import { PrismaCommentAttachmentsRepositoryImpl } from '../persistence/prisma/repositories/prisma-comment-attachments-repository.impl';
import { PrismaCommentsRepositoryImpl } from '../persistence/prisma/repositories/prisma-comments-repository.impl';
import { PrismaTaskAttachmentsRepositoryImpl } from '../persistence/prisma/repositories/prisma-task-attachments-repository.impl';
import { PrismaTasksRepositoryImpl } from '../persistence/prisma/repositories/prisma-tasks-repository.impl';
import { FileSystemStorageImpl } from '../storage/file-system-storage.impl';
import { StorageModule } from '../storage/storage.module';
import { ChangeFavoriteTaskController } from './controllers/change-favorite-task.controller';
import { CreateCommentController } from './controllers/create-comment.controller';
import { CreateTaskController } from './controllers/create-task.controller';
import { DeleteCommentController } from './controllers/delete-comment.controller';
import { DeleteTaskController } from './controllers/delete-task.controller';
import { EditCommentController } from './controllers/edit-comment.controller';
import { EditTaskController } from './controllers/edit-task.controller';
import { FetchRecentTasksController } from './controllers/fetch-recent-tasks.controller';
import { GetTaskWithDetailsController } from './controllers/get-task-with-details.controller';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';

@Module({
  imports: [PersistenceModule, StorageModule],
  controllers: [
    CreateTaskController,
    FetchRecentTasksController,
    EditTaskController,
    DeleteTaskController,
    ChangeFavoriteTaskController,
    UploadAttachmentController,
    GetTaskWithDetailsController,
    CreateCommentController,
    DeleteCommentController,
    EditCommentController
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
    {
      provide: CreateCommentUseCase,
      useFactory: (tasksRepository: PrismaTasksRepositoryImpl, commentsRepository: PrismaCommentsRepositoryImpl) =>
        new CreateCommentUseCase(tasksRepository, commentsRepository),
      inject: [PrismaTasksRepositoryImpl, PrismaCommentsRepositoryImpl],
    },
    {
      provide: DeleteCommentUseCase,
      useFactory: (repository: PrismaCommentsRepositoryImpl) =>
        new DeleteCommentUseCase(repository),
      inject: [PrismaCommentsRepositoryImpl],
    },
    {
      provide: EditCommentUseCase,
      useFactory: (commentsRepository: PrismaCommentsRepositoryImpl, commentAttachmentsRepository: PrismaCommentAttachmentsRepositoryImpl) =>
        new EditCommentUseCase(commentsRepository, commentAttachmentsRepository),
      inject: [PrismaCommentsRepositoryImpl, PrismaCommentAttachmentsRepositoryImpl],
    },
  ],
})
export class HttpModule { }
