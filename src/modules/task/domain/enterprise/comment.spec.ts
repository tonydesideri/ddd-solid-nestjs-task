import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { makeComment } from 'test/factories/make-comment.factory';
import { Comment } from './comment.entity';

describe('Comment', () => {
  it('should create a comment instance with default createdAt if not provided', () => {
    // Assert
    // Act
    const comment = makeComment({
      taskId: new UniqueEntityID('task-1'),
      content: 'content',
    });

    // expect
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.taskId).toEqual(new UniqueEntityID('task-1'));
    expect(comment.content).toEqual('content');
    expect(comment.createdAt).toBeInstanceOf(Date);
    expect(comment.updatedAt).toBeUndefined();
  });

  it('should create a comment instance with provided createdAt', () => {
    const comment = makeComment({
      taskId: new UniqueEntityID(),
      content: 'teste',
    });

    comment.content = 'Novo Teste';

    expect(comment).toBeInstanceOf(Comment);
    expect(comment.content).toEqual('Novo Teste');
    expect(comment.updatedAt).toBeInstanceOf(Date);
  });
});
