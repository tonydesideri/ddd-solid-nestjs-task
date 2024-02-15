import { InMemoryCommentsRepositoryImpl } from 'test/repositories/in-memory-comments-repository.impl ';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { CreateCommentUseCase } from './create-comment.use-case';
import { makeTask } from 'test/factories/make-task.factory';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

describe('CreateCommentUseCase', () => {
  // Arrange
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let inMemoryCommentsRepository: InMemoryCommentsRepositoryImpl;

  let createCommentUseCase: CreateCommentUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
    inMemoryCommentsRepository = new InMemoryCommentsRepositoryImpl();

    createCommentUseCase = new CreateCommentUseCase(
      inMemoryTasksRepository,
      inMemoryCommentsRepository,
    );
  });

  it('Deve ser possivel criar um comentario', async () => {
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(task);

    const comment = {
      taskId: 'task-1',
      content: 'Content',
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
    };

    // Act
    const result = await createCommentUseCase.execute(comment);

    // Assert
    expect(result.isFailure()).toBe(true);
    expect(inMemoryCommentsRepository.items).toHaveLength(0);
  });
});
