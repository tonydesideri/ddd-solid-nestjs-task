import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'crypto'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/common/database/database.module'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment.factory'
import { CommentAttachmentFactory } from 'test/factories/make-comment-attachment.factory'
import { CommentFactory } from 'test/factories/make-comment.factory'
import { TaskAttachmentFactory } from 'test/factories/make-task-attachment.factory'
import { TaskFactory } from 'test/factories/make-task.factory'

describe('Fetch recent tasks (E2E)', () => {
  let app: INestApplication
  let taskFactory: TaskFactory
  let taskAttachmentFactory: TaskAttachmentFactory
  let attachmentFactory: AttachmentFactory
  let commentAttachmentFactory: CommentAttachmentFactory
  let commentFactory: CommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TaskFactory, TaskAttachmentFactory, AttachmentFactory, CommentFactory, CommentAttachmentFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    taskFactory = moduleRef.get(TaskFactory)
    taskAttachmentFactory = moduleRef.get(TaskAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    commentAttachmentFactory = moduleRef.get(CommentAttachmentFactory)
    commentFactory = moduleRef.get(CommentFactory)

    await app.init()
  })

  test('[GET] /task-detail/:id', async () => {
    // Criar uma tarefa
    const task = await taskFactory.makePrismaTask({
      title: 'Task 01',
    })
    // Criar um anexo
    const attachment1 = await attachmentFactory.makePrismaAttachment({
      title: "Attachment 1"
    })
    // Vincular um anexo a tarefa
    await taskAttachmentFactory.makePrismaTaskAttachment({
      attachmentId: attachment1.id,
      taskId: task.id
    })
    // Criar um comentario
    const comment = await commentFactory.makePrismaComment({
      taskId: task.id,
      content: "Content 1"
    })
    // Criar um anexo para o comentario
    const attachment2 = await attachmentFactory.makePrismaAttachment({
      title: "Attachment 2"
    })
    await commentAttachmentFactory.makePrismaCommentAttachment({
      attachmentId: attachment2.id,
      commentId: comment.id
    })

    const response = await request(app.getHttpServer())
      .get(`/task-detail/${task.id.toString()}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      task: expect.objectContaining({
        title: "Task 01",
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: "Attachment 1"
          })
        ]),
        comments: [
          expect.objectContaining({
            content: "Content 1",
            attachments: [
              expect.objectContaining({
                title: "Attachment 2"
              })
            ]
          })
        ]
      })
    })
  })

  test('[GET] /task-detail/:id with id not exist.', async () => {
    await taskFactory.makePrismaTask()

    const response = await request(app.getHttpServer())
      .get(`/task-detail/${randomUUID()}`)
      .send()

    expect(response.statusCode).toBe(404);
  });
})