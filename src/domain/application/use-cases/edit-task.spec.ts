import { InMemoryTaskAttachmentsRepositoryImpl } from 'test/repositories/in-memory-task-attachments-repository.impl ';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { EditTaskUseCase } from './edit-task.use-case';
import { makeTask } from 'test/factories/make-task.factory';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('Edit Task', () => {
  let inMemoryTaskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl;
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let sut: EditTaskUseCase;

  beforeEach(() => {
    inMemoryTaskAttachmentsRepository =
      new InMemoryTaskAttachmentsRepositoryImpl();
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl(
      inMemoryTaskAttachmentsRepository,
    );

    sut = new EditTaskUseCase(
      inMemoryTasksRepository,
      inMemoryTaskAttachmentsRepository,
    );
  });

  it('should be able to edit a Task', async () => {
    const newTask = makeTask({}, new UniqueEntityID('Task-1'));

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

    await sut.execute({
      taskId: newTask.id.toValue(),
      description: 'Description',
      title: 'Title teste',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryTasksRepository.items[0]).toMatchObject({
      title: 'TITLE TESTE',
      description: 'Description',
    });

    expect(
      inMemoryTasksRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryTasksRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should throw an error if task is not found', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(newTask);

    // Act
    const result = await sut.execute({
      taskId: 'another-task-1',
      description: 'Description',
      title: 'Title teste',
      attachmentsIds: [],
    });

    // Assert
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to edit a Task and sync new and remove attachment', async () => {
    const newTask = makeTask({}, new UniqueEntityID('Task-1'));

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

    console.log("Criação", inMemoryTaskAttachmentsRepository.items)

    const result = await sut.execute({
      taskId: newTask.id.toValue(),
      description: 'Description',
      title: 'Title teste',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryTaskAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryTaskAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1")
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("3")
        })
      ])
    )
  });
});
