import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { EditTaskUseCase } from './edit-task.use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('Edit Task', () => {
  let inMemory: InMemoryRepositoriesProps;

  let sut: EditTaskUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    sut = new EditTaskUseCase(
      inMemory.TasksRepository,
      inMemory.TaskAttachmentsRepository,
    );
  });

  it('should be able to edit a Task', async () => {
    const newTask = makeTask({}, new UniqueEntityID('Task-1'));

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

    await sut.execute({
      taskId: newTask.id.toValue(),
      description: 'Description',
      title: 'Title teste',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemory.TasksRepository.items[0]).toMatchObject({
      title: 'TITLE TESTE',
      description: 'Description',
    });

    expect(
      inMemory.TasksRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemory.TasksRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should throw an error if task is not found', async () => {
    // Arrange
    const newTask = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(newTask);

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

    const result = await sut.execute({
      taskId: newTask.id.toValue(),
      description: 'Description',
      title: 'Title teste',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isSuccess()).toBe(true)
    expect(inMemory.TaskAttachmentsRepository.items).toHaveLength(2)
    expect(inMemory.TaskAttachmentsRepository.items).toEqual(
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
