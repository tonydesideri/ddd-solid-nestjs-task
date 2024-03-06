import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('DeleteTaskUseCase', () => {
  let inMemory: InMemoryRepositoriesProps;

  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    deleteTaskUseCase = new DeleteTaskUseCase(inMemory.TasksRepository);
  });

  it('should delete a task', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(newTask);

    inMemory.TaskAttachmentsRepository.items.push(
      makeTaskAttachment({
        taskId: newTask.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeTaskAttachment({
        taskId: newTask.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    // Act
    await deleteTaskUseCase.execute({ taskId: 'task-1' });

    // Assert
    // Verifica se a tarefa foi removida corretamente do repositório
    expect(inMemory.TasksRepository.items).toHaveLength(0);
    expect(inMemory.TaskAttachmentsRepository.items).toHaveLength(0);
  });

  it('should throw an error if task is not found', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(newTask);

    // Act
    const result = await deleteTaskUseCase.execute({ taskId: 'another-task-1' });

    // Assert
    // Verifica se a execução do caso de uso lança um erro quando a tarefa não é encontrada
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
