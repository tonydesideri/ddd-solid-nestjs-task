import { makeTask } from 'test/factories/make-task.factory';

import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { ChangeFavoriteTaskUseCase } from './change-favorite-task.use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { InMemoryTaskAttachmentsRepositoryImpl } from 'test/repositories/in-memory-task-attachments-repository.impl ';
import { InMemoryAttachmentsRepositoryImpl } from 'test/repositories/in-mamory-attachments-repository.impl';
import { InMemoryCommentAttachmentsRepositoryImpl } from 'test/repositories/in-memory-comment-attachments-repository.impl ';
import { InMemoryCommentsRepositoryImpl } from 'test/repositories/in-memory-comments-repository.impl ';

describe('ChangeFavoriteTaskUseCase', () => {
  let inMemoryTaskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl;
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepositoryImpl
  let inMemoryCommentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl
  let inMemoryCommentsRepository: InMemoryCommentsRepositoryImpl

  let changeFavoriteTaskUseCase: ChangeFavoriteTaskUseCase;

  beforeEach(() => {
    inMemoryCommentAttachmentsRepository = new InMemoryCommentAttachmentsRepositoryImpl()
    inMemoryCommentsRepository = new InMemoryCommentsRepositoryImpl(inMemoryCommentAttachmentsRepository)
    inMemoryTaskAttachmentsRepository =
      new InMemoryTaskAttachmentsRepositoryImpl();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepositoryImpl();
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl(
      inMemoryTaskAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryCommentsRepository
    );

    changeFavoriteTaskUseCase = new ChangeFavoriteTaskUseCase(
      inMemoryTasksRepository,
    );
  });

  it('should change favorite a task', async () => {
    // Arrange
    const newTask = makeTask(
      {
        isFavorite: false,
      },
      new UniqueEntityID('task-1'),
    );
    await inMemoryTasksRepository.create(newTask);

    // Act
    await changeFavoriteTaskUseCase.execute({ taskId: 'task-1' });

    // Assert
    // Verifica se a tarefa alterou o isFavorite
    expect(inMemoryTasksRepository.items[0].isFavorite).toEqual(true);
  });

  it('should throw an error if task is not found', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(newTask);

    // Act
    const result = await changeFavoriteTaskUseCase.execute({
      taskId: 'another-task-1',
    });
    // Assert
    // Verifica se a execução lançou um erro
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
