import { makeAttachment } from 'test/factories/make-attachment.factory';
import { makeCommentAttachment } from 'test/factories/make-comment-attachment.factory';
import { makeComment } from 'test/factories/make-comment.factory';
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from 'test/factories/make-in-memory-repositories.factory';
import { makeTaskAttachment } from 'test/factories/make-task-attachment.factory';
import { makeTask } from 'test/factories/make-task.factory';
import { GetTaskWithDetailsUseCase } from './get-task-with-details.use-case';

describe('GetTaskWithDetailsUseCase', () => {
  let inMemory: InMemoryRepositoriesProps;

  let getTaskWithDetailsUseCase: GetTaskWithDetailsUseCase;

  beforeEach(() => {
    inMemory = makeInMemoryRepositories()

    getTaskWithDetailsUseCase = new GetTaskWithDetailsUseCase(inMemory.TasksRepository);
  });

  it('should be get taska with details', async () => {
    // Preparação
    // Criar uma tarefa
    const task = makeTask({
      status: "TODO",
      title: "Some title",
    })
    inMemory.TasksRepository.items.push(task);

    // Criar um anexo para a tarefa
    const attachment1 = makeAttachment({ title: "Attachment 1" })
    const attachment2 = makeAttachment({ title: "Attachment 2" })

    inMemory.AttachmentsRepository.items.push(attachment1);
    inMemory.AttachmentsRepository.items.push(attachment2);

    const taskAttachment1 = makeTaskAttachment({
      attachmentId: attachment1.id,
      taskId: task.id
    })
    const taskAttachment2 = makeTaskAttachment({
      attachmentId: attachment2.id,
      taskId: task.id
    })

    inMemory.TaskAttachmentsRepository.items.push(taskAttachment1)
    inMemory.TaskAttachmentsRepository.items.push(taskAttachment2)

    // Criar um comentario para a tarefa
    const comment1 = makeComment({
      taskId: task.id,
      content: "Some content 1"
    })
    const comment2 = makeComment({
      taskId: task.id,
      content: "Some content 2"
    })

    inMemory.CommentsRepository.items.push(comment1)
    inMemory.CommentsRepository.items.push(comment2)

    // Criar um anexo para o comentario
    const attachment3 = makeAttachment({ title: "Attachment 3" })
    const attachment4 = makeAttachment({ title: "Attachment 4" })

    inMemory.AttachmentsRepository.items.push(attachment3);
    inMemory.AttachmentsRepository.items.push(attachment4);

    const commentAttachment1 = makeCommentAttachment({
      attachmentId: attachment3.id,
      commentId: comment1.id
    })
    const commentAttachment2 = makeCommentAttachment({
      attachmentId: attachment4.id,
      commentId: comment2.id
    })

    inMemory.CommentAttachmentsRepository.items.push(commentAttachment1)
    inMemory.CommentAttachmentsRepository.items.push(commentAttachment2)

    // Act
    const result = await getTaskWithDetailsUseCase.execute({
      taskId: task.id.toString()
    });

    //Verifica se a execução de sucesso
    expect(result.isSuccess()).toBe(true);
    // //Verifica se a ordenação funcionou corretamente
    expect(result.value).toEqual({
      task: expect.objectContaining({
        status: "TODO",
        title: "Some title",
        attachments: [
          expect.objectContaining({
            title: "Attachment 1"
          }),
          expect.objectContaining({
            title: "Attachment 2"
          }),
        ],
        comments: [
          expect.objectContaining({
            content: "Some content 1",
            attachments: [
              expect.objectContaining({
                title: "Attachment 3"
              })
            ]
          }),
          expect.objectContaining({
            content: "Some content 2",
            attachments: [
              expect.objectContaining({
                title: "Attachment 4"
              })
            ]
          })
        ]
      }),
    });
  });

  it('should be get task with details without comments', async () => {
    // Preparação
    // Criar uma tarefa
    const task = makeTask({
      status: "TODO",
      title: "Some title",
    })
    inMemory.TasksRepository.items.push(task);

    // Act
    const result = await getTaskWithDetailsUseCase.execute({
      taskId: task.id.toString()
    });

    //Verifica se a execução de sucesso
    expect(result.isSuccess()).toBe(true);
    // //Verifica se a ordenação funcionou corretamente
    expect(result.value).toEqual({
      task: expect.objectContaining({
        status: "TODO",
        title: "Some title",
        attachments: expect.arrayContaining([]),
        comments: expect.arrayContaining([])
      }),
    });
  });
});
