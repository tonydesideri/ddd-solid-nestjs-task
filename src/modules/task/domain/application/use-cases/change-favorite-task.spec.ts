import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { ChangeFavoriteTaskUseCase } from './change-favorite-task.use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('ChangeFavoriteTaskUseCase', () => {
  let inMemory: InMemoryRepositoriesProps;

  let changeFavoriteTaskUseCase: ChangeFavoriteTaskUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    changeFavoriteTaskUseCase = new ChangeFavoriteTaskUseCase(
      inMemory.TasksRepository,
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
    await inMemory.TasksRepository.create(newTask);

    // Act
    await changeFavoriteTaskUseCase.execute({ taskId: 'task-1' });

    // Assert
    // Verifica se a tarefa alterou o isFavorite
    expect(inMemory.TasksRepository.items[0].isFavorite).toEqual(true);
  });

  it('should throw an error if task is not found', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(newTask);

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
