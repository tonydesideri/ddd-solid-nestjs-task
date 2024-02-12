import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { CreateTaskUseCase } from './create-task.use-case';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

describe('CreateTaskUseCase', () => {
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl();
    createTaskUseCase = new CreateTaskUseCase(inMemoryTasksRepository);
  });

  it('should create a task', async () => {
    // Act
    const result = await createTaskUseCase.execute({
      title: 'Title',
      description: 'Description',
      attachmentsIds: ['1', '2'],
    });

    // Assert
    expect(result.isSuccess()).toBe(true);
    //Verifica se o items possui uma posição depois da crição
    expect(inMemoryTasksRepository.items).toHaveLength(1);
    //Verifica se a primeira posição é igual a da criação
    expect(inMemoryTasksRepository.items[0].title).toEqual('Title');
    // Verificando se foi criado os anexos
    expect(
      inMemoryTasksRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryTasksRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
});
