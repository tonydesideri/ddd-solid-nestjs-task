import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { CreateTaskUseCase } from './create-task.use-case';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { InMemoryTaskAttachmentsRepositoryImpl } from 'test/repositories/in-memory-task-attachments-repository.impl ';
import { InMemoryAttachmentsRepositoryImpl } from 'test/repositories/in-mamory-attachments-repository.impl';
import { InMemoryCommentAttachmentsRepositoryImpl } from 'test/repositories/in-memory-comment-attachments-repository.impl ';
import { InMemoryCommentsRepositoryImpl } from 'test/repositories/in-memory-comments-repository.impl ';

describe('CreateTaskUseCase', () => {
  let inMemoryTaskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl;
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepositoryImpl
  let inMemoryCommentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl
  let inMemoryCommentsRepository: InMemoryCommentsRepositoryImpl

  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    inMemoryCommentAttachmentsRepository = new InMemoryCommentAttachmentsRepositoryImpl()
    inMemoryCommentsRepository = new InMemoryCommentsRepositoryImpl(inMemoryCommentAttachmentsRepository)
    inMemoryTaskAttachmentsRepository =
      new InMemoryTaskAttachmentsRepositoryImpl();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepositoryImpl()
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl(
      inMemoryTaskAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryCommentsRepository
    );

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
    expect(inMemoryTaskAttachmentsRepository.items).toHaveLength(2);
  });
});
