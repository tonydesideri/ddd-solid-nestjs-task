import { makeTask } from 'test/factories/make-task.factory';
import { InMemoryTasksRepositoryImpl } from '../repositories/in-memory-tasks-repository.impl';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

describe('DeleteTaskUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
    deleteTaskUseCase = new DeleteTaskUseCase(inMemoryTasksRepository);
  });

  it('should delete a task', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(newTask);

    // Act
    await deleteTaskUseCase.execute({ id: 'task-1' });

    // Assert
    // Verifica se a tarefa foi removida corretamente do repositório
    expect(inMemoryTasksRepository.items).toHaveLength(0);
  });

  it('should throw an error if task is not found', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(newTask);

    // Act & Assert
    // Verifica se a execução do caso de uso lança um erro quando a tarefa não é encontrada
    await expect(
      deleteTaskUseCase.execute({ id: 'another-task-1' }),
    ).rejects.toThrow('Task not found');
  });
});
