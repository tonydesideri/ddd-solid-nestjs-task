import { InMemoryCommentsRepositoryImpl } from 'test/repositories/in-memory-comments-repository.impl ';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { CreateCommentUseCase } from './create-comment.use-case';
import { makeTask } from 'test/factories/make-task.factory';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { InMemoryTaskAttachmentsRepositoryImpl } from 'test/repositories/in-memory-task-attachments-repository.impl ';
import { InMemoryCommentAttachmentsRepositoryImpl } from 'test/repositories/in-memory-comment-attachments-repository.impl ';
import { InMemoryAttachmentsRepositoryImpl } from 'test/repositories/in-mamory-attachments-repository.impl';

describe('CreateCommentUseCase', () => {
  // Arrange
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepositoryImpl
  let inMemoryTaskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;

  let inMemoryCommentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl
  let inMemoryCommentsRepository: InMemoryCommentsRepositoryImpl;

  let createCommentUseCase: CreateCommentUseCase;

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepositoryImpl()
    inMemoryTaskAttachmentsRepository = new InMemoryTaskAttachmentsRepositoryImpl()
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl(
      inMemoryTaskAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryCommentsRepository
    );

    inMemoryCommentAttachmentsRepository = new InMemoryCommentAttachmentsRepositoryImpl()
    inMemoryCommentsRepository = new InMemoryCommentsRepositoryImpl(inMemoryCommentAttachmentsRepository);

    createCommentUseCase = new CreateCommentUseCase(
      inMemoryTasksRepository,
      inMemoryCommentsRepository,
    );
  });

  it('Deve ser possivel criar um comentario com anexo', async () => {
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(task);

    const comment = {
      taskId: 'task-1',
      content: 'Content',
      attachmentsIds: ['1', '2'],
    };

    // Act
    const result = await createCommentUseCase.execute(comment);

    // Assert
    expect(result.isSuccess()).toBe(true);
    expect(inMemoryCommentsRepository.items).toHaveLength(1);
    expect(inMemoryCommentsRepository.items[0].content).toBe(comment.content);
  });

  it('Não deve ser possivel criar um comentario sem uma tarefa', async () => {
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(task);

    const comment = {
      taskId: 'task-2',
      content: 'Content',
      attachmentsIds: ['1', '2'],
    };

    // Act
    const result = await createCommentUseCase.execute(comment);

    // Assert
    expect(result.isFailure()).toBe(true);
    expect(inMemoryCommentsRepository.items).toHaveLength(0);
  });
});
