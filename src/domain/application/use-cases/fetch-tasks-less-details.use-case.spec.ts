import { makeTask } from 'test/factories/make-task.factory';
import { InMemoryTasksRepositoryImpl } from 'test/repositories/in-memory-tasks-repository.impl';
import { InMemoryTaskAttachmentsRepositoryImpl } from 'test/repositories/in-memory-task-attachments-repository.impl ';
import { InMemoryAttachmentsRepositoryImpl } from 'test/repositories/in-mamory-attachments-repository.impl';
import { makeAttachment } from 'test/factories/make-attachment.factory';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';
import { FetchTasksLessDetailsUseCase } from './fetch-tasks-less-details.use-case';
import { InMemoryCommentsRepositoryImpl } from 'test/repositories/in-memory-comments-repository.impl ';
import { InMemoryCommentAttachmentsRepositoryImpl } from 'test/repositories/in-memory-comment-attachments-repository.impl ';
import { makeComment } from 'test/factories/make-comment.factory';

describe('FetchTasksLessDetailsUseCase', () => {
  let inMemoryTaskAttachmentsRepository: InMemoryTaskAttachmentsRepositoryImpl;
  let inMemoryTasksRepository: InMemoryTasksRepositoryImpl;
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepositoryImpl
  let inMemoryCommentAttachmentsRepository: InMemoryCommentAttachmentsRepositoryImpl
  let inMemoryCommentsRepository: InMemoryCommentsRepositoryImpl

  let fetchTasksLessDetailsUseCase: FetchTasksLessDetailsUseCase;

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepositoryImpl()
    inMemoryCommentAttachmentsRepository = new InMemoryCommentAttachmentsRepositoryImpl()
    inMemoryCommentsRepository = new InMemoryCommentsRepositoryImpl(inMemoryCommentAttachmentsRepository)
    inMemoryTaskAttachmentsRepository =
      new InMemoryTaskAttachmentsRepositoryImpl();
    inMemoryTasksRepository = new InMemoryTasksRepositoryImpl(
      inMemoryTaskAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryCommentsRepository
    );

    fetchTasksLessDetailsUseCase = new FetchTasksLessDetailsUseCase(inMemoryTasksRepository);
  });

  it('should be fetch all recent tasks', async () => {
    // Preparação
    const task = makeTask({
      status: "TODO",
      title: "Some title",
    })

    inMemoryTasksRepository.items.push(task);

    const attachment1 = makeAttachment({ title: "Attachment 1" })
    const attachment2 = makeAttachment({ title: "Attachment 2" })
    const attachment3 = makeAttachment({ title: "Attachment 3" })

    inMemoryAttachmentsRepository.items.push(attachment1);
    inMemoryAttachmentsRepository.items.push(attachment2);
    inMemoryAttachmentsRepository.items.push(attachment3);

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

    inMemoryTaskAttachmentsRepository.items.push(taskAttachment1)
    inMemoryTaskAttachmentsRepository.items.push(taskAttachment2)
    inMemoryTaskAttachmentsRepository.items.push(taskAttachment3)

    const comment1 = makeComment({
      taskId: task.id
    })
    const comment2 = makeComment({
      taskId: task.id
    })

    inMemoryCommentsRepository.items.push(comment1)
    inMemoryCommentsRepository.items.push(comment2)

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
