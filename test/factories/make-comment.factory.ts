import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Comment, CommentProps } from 'src/domain/enterprise/comment.entity';

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = Comment.instance(
    {
      content: faker.lorem.sentence({ min: 10, max: 50 }),
      taskId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return comment;
}
