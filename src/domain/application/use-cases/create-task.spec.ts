import { CreateTaskUseCase } from './create-task.use-case';
import { InMemoryTasksRepositoryImpl } from '../repositories/in-memory-tasks-repository.impl';

describe('CreateTaskUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
    createTaskUseCase = new CreateTaskUseCase(inMemoryTasksRepository);
  });

  it('should create a task', async () => {
    // Act & Assert
    // Verifica se a execução da função execute() não lançou exceções
    await expect(
      async () =>
        await createTaskUseCase.execute({
          title: 'Title',
          description: 'Description',
        }),
    ).not.toThrow();
    //Verifica se o items possui uma posição depois da crição
    expect(inMemoryTasksRepository.items).toHaveLength(1);
    //Verifica se a primeira posição é igual a da criação
    expect(inMemoryTasksRepository.items[0].title).toEqual('Title');
  });
});
