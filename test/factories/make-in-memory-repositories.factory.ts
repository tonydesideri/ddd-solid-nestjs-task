import { InMemoryAttachmentsRepositoryImpl } from "test/repositories/in-mamory-attachments-repository.impl";
import { InMemoryCommentAttachmentsRepositoryImpl } from "test/repositories/in-memory-comment-attachments-repository.impl ";
import { InMemoryCommentsRepositoryImpl } from "test/repositories/in-memory-comments-repository.impl ";
import { InMemoryTaskAttachmentsRepositoryImpl } from "test/repositories/in-memory-task-attachments-repository.impl ";
import { InMemoryTasksRepositoryImpl } from "test/repositories/in-memory-tasks-repository.impl";

export interface InMemoryRepositoriesProps {
  TaskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl;
  TasksRepository: InMemoryTasksRepositoryImpl;
  AttachmentsRepository: InMemoryAttachmentsRepositoryImpl
  CommentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl
  CommentsRepository: InMemoryCommentsRepositoryImpl
}

export function makeInMemoryRepositories(): InMemoryRepositoriesProps {
  const inMemoryCommentAttachmentsRepository =
    new InMemoryCommentAttachmentsRepositoryImpl()
  const inMemoryTaskAttachmentsRepository =
    new InMemoryTaskAttachmentsRepositoryImpl();
  const inMemoryAttachmentsRepository =
    new InMemoryAttachmentsRepositoryImpl();

  const inMemoryCommentsRepository =
    new InMemoryCommentsRepositoryImpl(inMemoryCommentAttachmentsRepository)

  const inMemoryTasksRepository = new InMemoryTasksRepositoryImpl(
    inMemoryTaskAttachmentsRepository,
    inMemoryAttachmentsRepository,
    inMemoryCommentsRepository,
    inMemoryCommentAttachmentsRepository
  );

  return {
    CommentAttachmentsRepository: inMemoryCommentAttachmentsRepository,
    TaskAttachmentsRepository: inMemoryTaskAttachmentsRepository,
    AttachmentsRepository: inMemoryAttachmentsRepository,
    CommentsRepository: inMemoryCommentsRepository,
    TasksRepository: inMemoryTasksRepository
  };
}