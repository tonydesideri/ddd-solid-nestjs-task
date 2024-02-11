import { InMemoryTasksRepositoryImpl } from '../repositories/in-memory-tasks-repository.impl';

import { makeTask } from 'test/factories/make-task.factory';
import { FetchTasksUseCase } from './fetch-tasks.use-case';

describe('FetchTasksUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let fetchTasksUseCase: FetchTasksUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
    fetchTasksUseCase = new FetchTasksUseCase(inMemoryTasksRepository);
  });

  it('should be fetch all tasks', async () => {
    // Assert
    const task = makeTask({ title: 'Title' });
    inMemoryTasksRepository.create(task);

    // Act
    const { tasks } = await fetchTasksUseCase.execute();

    //Verifica se tasks possui uma posição depois da crição e busca
    expect(tasks).toHaveLength(1);
    //Verifica se a primeira posição é igual a da criação
    expect(tasks[0].title).toEqual('Title');
  });
});
