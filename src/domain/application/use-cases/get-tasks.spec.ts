import { InMemoryTasksRepositoryImpl } from '../repositories/in-memory-tasks-repository.impl';
import { GetTasksUseCase } from './get-tasks.use-case';
import { makeTask } from 'test/factories/make-task.factory';

describe('CreateTaskUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let getTasksUseCase: GetTasksUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
    getTasksUseCase = new GetTasksUseCase(inMemoryTasksRepository);
  });

  it('should create a task', async () => {
    // Assert
    const task = makeTask({ title: 'Title' });
    inMemoryTasksRepository.create(task);

    // Act
    const { tasks } = await getTasksUseCase.execute();

    //Verifica se tasks possui uma posição depois da crição e busca
    expect(tasks).toHaveLength(1);
    //Verifica se a primeira posição é igual a da criação
    expect(tasks[0].title).toEqual('Title');
  });
});
