import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { CreateCommentUseCase } from './create-comment.use-case';

describe('CreateCommentUseCase', () => {
  // Arrange
  let inMemory: InMemoryRepositoriesProps;

  let createCommentUseCase: CreateCommentUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    createCommentUseCase = new CreateCommentUseCase(
      inMemory.TasksRepository,
      inMemory.CommentsRepository,
    );
  });

  it('Deve ser possivel criar um comentario com anexo', async () => {
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(task);

    const comment = {
      taskId: 'task-1',
      content: 'Content',
      attachmentsIds: ['1', '2'],
    };

    // Act
    const result = await createCommentUseCase.execute(comment);

    // Assert
    expect(result.isSuccess()).toBe(true);
    expect(inMemory.CommentsRepository.items).toHaveLength(1);
    expect(inMemory.CommentsRepository.items[0].content).toBe(comment.content);
    // Verificando se foi criado os anexos
    expect(
      inMemory.CommentsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemory.CommentsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
    expect(inMemory.CommentAttachmentsRepository.items).toHaveLength(2);
  });

  it('Não deve ser possivel criar um comentario sem uma tarefa', async () => {
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(task);

    const comment = {
      taskId: 'task-2',
      content: 'Content',
      attachmentsIds: ['1', '2'],
    };

    // Act
    const result = await createCommentUseCase.execute(comment);

    // Assert
    expect(result.isFailure()).toBe(true);
    expect(inMemory.CommentsRepository.items).toHaveLength(0);
  });
});
