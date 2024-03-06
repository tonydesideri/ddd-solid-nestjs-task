
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { makeCommentAttachment } from 'test/factories/make-comment-attachment.factory';
import { makeComment } from 'test/factories/make-comment.factory';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { EditCommentUseCase } from './edit-comment.use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

describe('Edit Comment', () => {
  let inMemory: InMemoryRepositoriesProps;

  let sut: EditCommentUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    sut = new EditCommentUseCase(
      inMemory.CommentsRepository,
      inMemory.CommentAttachmentsRepository,
    );
  });

  it('should be able to edit a Comment', async () => {
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemory.TasksRepository.create(task);

    const newComment = makeComment(
      {
        taskId: task.id,
      },
      new UniqueEntityID('Comment-1'),
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

    await sut.execute({
      commentId: newComment.id.toValue(),
      content: 'Title teste',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemory.CommentsRepository.items[0]).toMatchObject({
      content: 'Title teste',
    });

    expect(
      inMemory.CommentsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemory.CommentsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
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
    const result = await sut.execute({
      commentId: 'another-comment-1',
      content: 'Description',
      attachmentsIds: [],
    });

    // Assert
    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to edit a comment and sync new and remove attachment', async () => {
    const newTask = makeTask({}, new UniqueEntityID('Task-1'));
    await inMemory.TasksRepository.create(newTask);

    const comment = makeComment({
      taskId: newTask.id
    })
    inMemory.CommentsRepository.create(comment)

    inMemory.CommentAttachmentsRepository.items.push(
      makeCommentAttachment({
        commentId: comment.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeCommentAttachment({
        commentId: comment.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    const result = await sut.execute({
      commentId: comment.id.toValue(),
      content: 'Content',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isSuccess()).toBe(true)
    expect(inMemory.CommentAttachmentsRepository.items).toHaveLength(2)
    expect(inMemory.CommentAttachmentsRepository.items).toEqual(
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
