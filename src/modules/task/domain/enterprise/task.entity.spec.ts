import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { Task } from './task.entity';

describe('TaskEntity', () => {
  it('should create a task entity with default values', () => {
    const task = Task.instance({
      title: 'Default Task',
      description: 'Default Task Description',
    });

    expect(task).toBeDefined();
    expect(task.title).toBe('Default Task');
    expect(task.description).toBe('Default Task Description');
    expect(task.isFavorite).toBe(false);
    expect(task.status).toBe('TODO');
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeUndefined();
    expect(task.excerpt).toBe('Default Task Description...');
  });

  it('should create a task entity with provided values', () => {
    const createdAt = new Date('2022-01-01');
    const updatedAt = new Date('2022-01-02');
    const task = Task.instance(
      {
        title: 'Custom Task',
        description: 'Custom Task Description',
        isFavorite: true,
        status: 'DONE',
        createdAt,
        updatedAt,
      },
      new UniqueEntityID('1'),
    );
    expect(task).toBeDefined();
    expect(task.title).toBe('Custom Task');
    expect(task.description).toBe('Custom Task Description');
    expect(task.isFavorite).toBe(true);
    expect(task.status).toBe('DONE');
    expect(task.createdAt).toBe(createdAt);
    expect(task.updatedAt).toBe(updatedAt);
    expect(task.excerpt).toBe('Custom Task Description...');
  });

  it('should update task properties and set updatedAt', () => {
    const task = Task.instance({
      title: 'Task',
      description: 'Task Description',
    });

    task.title = 'Updated Task';
    task.description = 'Updated Task Description';
    task.isFavorite = true;
    task.status = 'DONE';

    expect(task.title).toBe('UPDATED TASK');
    expect(task.description).toBe('Updated Task Description');
    expect(task.isFavorite).toBe(true);
    expect(task.status).toBe('DONE');
    expect(task.updatedAt).toBeInstanceOf(Date);
  });
});
