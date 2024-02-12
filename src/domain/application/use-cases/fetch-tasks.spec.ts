import { makeTask } from 'test/factories/make-task.factory';
import { FetchTasksUseCase } from './fetch-tasks.use-case';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';

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
    const result = await fetchTasksUseCase.execute({ page: 1 });

    //Verifica se a execução de sucesso
    expect(result.isSuccess()).toBe(true);
    //Verifica se tasks possui 3 possições no array
    expect(result.value.tasks).toHaveLength(3);
    //Verifica se a ordenação funcionou corretamente
    expect(result.value.tasks).toEqual([
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
    const result = await fetchTasksUseCase.execute({ page: 3 });

    //Verifica se a execução de sucesso
    expect(result.isSuccess()).toBe(true);
    // Verifique se a ultima paginação possui apenas 2 objetos
    expect(result.value.tasks).toHaveLength(2);
  });
});
