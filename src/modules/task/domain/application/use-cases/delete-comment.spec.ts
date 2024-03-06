import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { makeCommentAttachment } from 'test/factories/make-comment-attachment.factory';
import { makeComment } from 'test/factories/make-comment.factory';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { DeleteCommentUseCase } from './delete-comment.use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('DeleteCommentUseCase', () => {
  let inMemory: InMemoryRepositoriesProps;
  let deleteCommentUseCase: DeleteCommentUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    deleteCommentUseCase = new DeleteCommentUseCase(inMemory.CommentsRepository);
  });

  it('should delete a comment', async () => {
    // Arrange
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(task);

    const newComment = makeComment(
      {
        taskId: task.id,
      },
      new UniqueEntityID('comment-1'),
    );
    await inMemory.CommentsRepository.create(newComment);

    inMemory.CommentAttachmentsRepository.items.push(
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
    await deleteCommentUseCase.execute({ commentId: 'comment-1' });

    // Assert
    // Verifica se a tarefa foi removida corretamente do repositório
    expect(inMemory.CommentsRepository.items).toHaveLength(0);
    expect(inMemory.CommentAttachmentsRepository.items).toHaveLength(0);
  });

  it('should throw an error if comment is not found', async () => {
    // Arrange
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(task);

    const newComment = makeComment(
      {
        taskId: task.id,
      },
      new UniqueEntityID('comment-1'),
    );
    await inMemory.CommentsRepository.create(newComment);

    // Act
    const result = await deleteCommentUseCase.execute({ commentId: 'another-comment-1' });

    // Assert
    // Verifica se a execução do caso de uso lança um erro quando a tarefa não é encontrada
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
