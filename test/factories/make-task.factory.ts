import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Task, TaskProps } from 'src/domain/enterprise/task.entity';

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueEntityID,
) {
  const task = Task.instance(
    {
      title: faker.lorem.sentence(),
      description: faker.lorem.text(),
      isFavorite: false,
      status: 'TODO',
      ...override,
    },
    id,
  );

  return task;
}
