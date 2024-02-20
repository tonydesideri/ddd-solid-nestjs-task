import { makeTask } from 'test/factories/make-task.factory';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { InMemoryTaskAttachmentsRepositoryImpl } from 'test/repositories/in-memory-task-attachments-repository.impl ';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';

describe('DeleteTaskUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let inMemoryTaskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl;
  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(() => {
    inMemoryTaskAttachmentsRepository =
      new InMemoryTaskAttachmentsRepositoryImpl();
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl(
      inMemoryTaskAttachmentsRepository,
    );

    deleteTaskUseCase = new DeleteTaskUseCase(inMemoryTasksRepository);
  });

  it('should delete a task', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(newTask);

    inMemoryTaskAttachmentsRepository.items.push(
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
    expect(inMemoryTasksRepository.items).toHaveLength(0);
    expect(inMemoryTaskAttachmentsRepository.items).toHaveLength(0);
  });

  it('should throw an error if task is not found', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(newTask);

    // Act
    const result = await deleteTaskUseCase.execute({ taskId: 'another-task-1' });

    // Assert
    // Verifica se a execução do caso de uso lança um erro quando a tarefa não é encontrada
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
