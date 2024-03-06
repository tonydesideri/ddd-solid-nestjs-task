import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { CreateTaskUseCase } from './create-task.use-case';

describe('CreateTaskUseCase', () => {
  let inMemory: InMemoryRepositoriesProps;

  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    createTaskUseCase = new CreateTaskUseCase(inMemory.TasksRepository);
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
    expect(inMemory.TasksRepository.items).toHaveLength(1);
    //Verifica se a primeira posição é igual a da criação
    expect(inMemory.TasksRepository.items[0].title).toEqual('Title');
    // Verificando se foi criado os anexos
    expect(
      inMemory.TasksRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemory.TasksRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });

  it('should create a attachments', async () => {
    // Act
    const result = await createTaskUseCase.execute({
      title: 'Title',
      description: 'Description',
      attachmentsIds: ['1', '2'],
    });

    // Assert
    expect(result.isSuccess()).toBe(true);
    //Verifica se o items possui uma posição depois da crição
    expect(inMemory.TaskAttachmentsRepository.items).toHaveLength(2);
  });
});
