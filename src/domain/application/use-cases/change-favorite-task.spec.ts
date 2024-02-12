import { makeTask } from 'test/factories/make-task.factory';

import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { ChangeFavoriteTaskUseCase } from './change-favorite-task.use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';

describe('ChangeFavoriteTaskUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let changeFavoriteTaskUseCase: ChangeFavoriteTaskUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
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
    await changeFavoriteTaskUseCase.execute({ id: 'task-1' });

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
      id: 'another-task-1',
    });
    // Assert
    // Verifica se a execução lançou um erro
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
