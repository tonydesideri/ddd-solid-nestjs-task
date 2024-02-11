import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Task, TaskProps } from 'src/domain/enterprise/task.entity';

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueEntityID,
) {
  const task = Task.instance(
    {
      title: faker.lorem.sentence(5),
      description: faker.lorem.sentence({ min: 10, max: 50 }),
      isFavorite: false,
      status: 'TODO',
      ...override,
    },
    id,
  );

  return task;
}
