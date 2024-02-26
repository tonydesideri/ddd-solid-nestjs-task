import { makeAttachment } from 'test/factories/make-attachment.factory';
import { makeComment } from 'test/factories/make-comment.factory';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { FetchTasksLessDetailsUseCase } from './fetch-tasks-less-details.use-case';

describe('FetchTasksLessDetailsUseCase', () => {
  let inMemory: InMemoryRepositoriesProps;

  let fetchTasksLessDetailsUseCase: FetchTasksLessDetailsUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    fetchTasksLessDetailsUseCase = new FetchTasksLessDetailsUseCase(inMemory.TasksRepository);
  });

  it('should be fetch all recent tasks', async () => {
    // Preparação
    const task = makeTask({
      status: "TODO",
      title: "Some title",
    })

    inMemory.TasksRepository.items.push(task);

    const attachment1 = makeAttachment({ title: "Attachment 1" })
    const attachment2 = makeAttachment({ title: "Attachment 2" })
    const attachment3 = makeAttachment({ title: "Attachment 3" })

    inMemory.AttachmentsRepository.items.push(attachment1);
    inMemory.AttachmentsRepository.items.push(attachment2);
    inMemory.AttachmentsRepository.items.push(attachment3);

    const taskAttachment1 = makeTaskAttachment({
      attachmentId: attachment1.id,
      taskId: task.id
    })
    const taskAttachment2 = makeTaskAttachment({
      attachmentId: attachment2.id,
      taskId: task.id
    })
    const taskAttachment3 = makeTaskAttachment({
      attachmentId: attachment3.id,
      taskId: task.id
    })

    inMemory.TaskAttachmentsRepository.items.push(taskAttachment1)
    inMemory.TaskAttachmentsRepository.items.push(taskAttachment2)
    inMemory.TaskAttachmentsRepository.items.push(taskAttachment3)

    const comment1 = makeComment({
      taskId: task.id
    })
    const comment2 = makeComment({
      taskId: task.id
    })

    inMemory.CommentsRepository.items.push(comment1)
    inMemory.CommentsRepository.items.push(comment2)

    // Act
    const result = await fetchTasksLessDetailsUseCase.execute();

    //Verifica se a execução de sucesso
    expect(result.isSuccess()).toBe(true);
    //Verifica se a ordenação funcionou corretamente
    expect(result.value.tasks).toEqual([
      expect.objectContaining({
        quantityAttachments: 3,
        quantityComments: 2,
        status: "TODO",
        title: "Some title"
      }),
    ]);
  });
});
