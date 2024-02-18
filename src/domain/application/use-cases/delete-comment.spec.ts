import { makeComment } from 'test/factories/make-comment.factory';
import { DeleteCommentUseCase } from './delete-comment.use-case';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { InMemoryCommentAttachmentsRepositoryImpl } from 'test/repositories/in-memory-comment-attachments-repository.impl ';
import { makeCommentAttachment } from 'test/factories/make-comment-attachment.factory';
import { InMemoryCommentsRepositoryImpl } from 'test/repositories/in-memory-comments-repository.impl ';
import { makeTask } from 'test/factories/make-task.factory';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';

describe('DeleteCommentUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let inMemoryCommentsRepository: InMemoryCommentsRepositoryImpl;
  let inMemoryCommentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl;
  let deleteCommentUseCase: DeleteCommentUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
    inMemoryCommentAttachmentsRepository =
      new InMemoryCommentAttachmentsRepositoryImpl();
    inMemoryCommentsRepository = new InMemoryCommentsRepositoryImpl(
      inMemoryCommentAttachmentsRepository,
    );

    deleteCommentUseCase = new DeleteCommentUseCase(inMemoryCommentsRepository);
  });

  it('should delete a comment', async () => {
    // Arrange
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(task);

    const newComment = makeComment(
      {
        taskId: task.id,
      },
      new UniqueEntityID('comment-1'),
    );
    await inMemoryCommentsRepository.create(newComment);

    inMemoryCommentAttachmentsRepository.items.push(
      makeCommentAttachment({
        commentId: newComment.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeCommentAttachment({
        commentId: newComment.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    // Act
    await deleteCommentUseCase.execute({ id: 'comment-1' });

    // Assert
    // Verifica se a tarefa foi removida corretamente do repositório
    expect(inMemoryCommentsRepository.items).toHaveLength(0);
    expect(inMemoryCommentAttachmentsRepository.items).toHaveLength(0);
  });

  it('should throw an error if comment is not found', async () => {
    // Arrange
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(task);

    const newComment = makeComment(
      {
        taskId: task.id,
      },
      new UniqueEntityID('comment-1'),
    );
    await inMemoryCommentsRepository.create(newComment);

    // Act
    const result = await deleteCommentUseCase.execute({
      id: 'another-comment-1',
    });

    // Assert
    // Verifica se a execução do caso de uso lança um erro quando a tarefa não é encontrada
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
