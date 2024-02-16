import { InMemoryCommentAttachmentsRepositoryImpl } from 'test/repositories/in-memory-comment-attachments-repository.impl ';

import { EditCommentUseCase } from './edit-comment.use-case';
import { makeComment } from 'test/factories/make-comment.factory';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { makeCommentAttachment } from 'test/factories/make-comment-attachment.factory';
import { InMemoryCommentsRepositoryImpl } from 'test/repositories/in-memory-comments-repository.impl ';
import { makeTask } from 'test/factories/make-task.factory';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';

describe('Edit Comment', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let inMemoryCommentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl;
  let inMemoryCommentsRepository: InMemoryCommentsRepositoryImpl;
  let sut: EditCommentUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();

    inMemoryCommentAttachmentsRepository =
      new InMemoryCommentAttachmentsRepositoryImpl();
    inMemoryCommentsRepository = new InMemoryCommentsRepositoryImpl();


    sut = new EditCommentUseCase(
      inMemoryCommentsRepository,
      inMemoryCommentAttachmentsRepository,
    );
  });

  it('should be able to edit a Comment', async () => {
    const task = makeTask({}, new UniqueEntityID('task-1'));
    await inMemoryTasksRepository.create(task);

    const newComment = makeComment({
      taskId: task.id
    }, new UniqueEntityID('Comment-1'));

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

    await sut.execute({
      commentId: newComment.id.toValue(),
      content: 'Title teste',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryCommentsRepository.items[0]).toMatchObject({
      content: 'Title teste',
    });

    expect(
      inMemoryCommentsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryCommentsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should throw an error if comment is not found', async () => {
    // Arrange
    const newComment = makeComment({}, new UniqueEntityID('comment-1'));
    await inMemoryCommentsRepository.create(newComment);

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
});
