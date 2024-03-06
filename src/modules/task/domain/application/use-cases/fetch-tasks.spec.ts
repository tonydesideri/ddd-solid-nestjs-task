import { makeAttachment } from 'test/factories/make-attachment.factory';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { FetchTasksUseCase } from './fetch-tasks.use-case';

describe('FetchTasksUseCase', () => {
  let inMemory: InMemoryRepositoriesProps;

  let fetchTasksUseCase: FetchTasksUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    fetchTasksUseCase = new FetchTasksUseCase(inMemory.TasksRepository);
  });

  it('should be fetch all recent tasks', async () => {
    // Assert
    const task1 = makeTask({ createdAt: new Date(2024, 1, 20) })
    const task2 = makeTask({ createdAt: new Date(2024, 1, 18) })
    const task3 = makeTask({ createdAt: new Date(2024, 1, 23) })

    inMemory.TasksRepository.items.push(task1);
    inMemory.TasksRepository.items.push(task2);
    inMemory.TasksRepository.items.push(task3);

    const attachment1 = makeAttachment({ title: "Attachment 1" })
    const attachment2 = makeAttachment({ title: "Attachment 2" })
    const attachment3 = makeAttachment({ title: "Attachment 3" })

    inMemory.AttachmentsRepository.items.push(attachment1);
    inMemory.AttachmentsRepository.items.push(attachment2);
    inMemory.AttachmentsRepository.items.push(attachment3);

    const taskAttachment1 = makeTaskAttachment({
      attachmentId: attachment1.id,
      taskId: task1.id
    })
    const taskAttachment2 = makeTaskAttachment({
      attachmentId: attachment2.id,
      taskId: task2.id
    })
    const taskAttachment3 = makeTaskAttachment({
      attachmentId: attachment3.id,
      taskId: task3.id
    })

    inMemory.TaskAttachmentsRepository.items.push(taskAttachment1)
    inMemory.TaskAttachmentsRepository.items.push(taskAttachment2)
    inMemory.TaskAttachmentsRepository.items.push(taskAttachment3)

    // Act
    const result = await fetchTasksUseCase.execute({ page: 1 });

    //Verifica se a execução de sucesso
    expect(result.isSuccess()).toBe(true);
    //Verifica se tasks possui 3 possições no array
    expect(result.value.tasks).toHaveLength(3);
    //Verifica se a ordenação funcionou corretamente
    expect(result.value.tasks).toEqual([
      expect.objectContaining({
        createdAt: new Date(2024, 1, 23),
        attachments: [
          expect.objectContaining({
            title: attachment3.title
          })
        ]
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 1, 20),
        attachments: [
          expect.objectContaining({
            title: attachment1.title
          })
        ]
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 1, 18),
        attachments: [
          expect.objectContaining({
            title: attachment2.title
          })
        ]
      }),
    ]);
  });

  it('should be fetch all paginated recent tasks', async () => {
    // Assert
    for (let i = 1; i <= 42; i++) {
      inMemory.TasksRepository.create(makeTask());
    }

    // Act
    const result = await fetchTasksUseCase.execute({ page: 3 });

    //Verifica se a execução de sucesso
    expect(result.isSuccess()).toBe(true);
    // Verifique se a ultima paginação possui apenas 2 objetos
    expect(result.value.tasks).toHaveLength(2);
  });
});
