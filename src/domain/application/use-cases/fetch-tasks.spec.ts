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

  it('should be fetch all recent tasks', async () => {
    // Assert
    inMemoryTasksRepository.create(
      makeTask({ createdAt: new Date(2024, 1, 20) }),
    );
    inMemoryTasksRepository.create(
      makeTask({ createdAt: new Date(2024, 1, 18) }),
    );
    inMemoryTasksRepository.create(
      makeTask({ createdAt: new Date(2024, 1, 23) }),
    );

    // Act
    const { tasks } = await fetchTasksUseCase.execute({ page: 1 });

    //Verifica se tasks possui 3 possições no array
    expect(tasks).toHaveLength(3);
    //Verifica se a ordenação funcionou corretamente
    expect(tasks).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 1, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 18) }),
    ]);
  });

  it('should be fetch all paginated recent tasks', async () => {
    // Assert
    for (let i = 1; i <= 42; i++) {
      inMemoryTasksRepository.create(makeTask());
    }

    // Act
    const { tasks } = await fetchTasksUseCase.execute({ page: 3 });

    // Verifique se a ultima paginação possui apenas 2 objetos
    expect(tasks).toHaveLength(2);
  });
});
