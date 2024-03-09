import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/common/database/database.module'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment.factory'
import { TaskAttachmentFactory } from 'test/factories/make-task-attachment.factory'
import { TaskFactory } from 'test/factories/make-task.factory'

describe('Fetch recent tasks (E2E)', () => {
  let app: INestApplication
  let taskFactory: TaskFactory
  let taskAttachmentFactory: TaskAttachmentFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TaskFactory, TaskAttachmentFactory, AttachmentFactory]

    }).compile()

    app = moduleRef.createNestApplication()

    taskFactory = moduleRef.get(TaskFactory)
    taskAttachmentFactory = moduleRef.get(TaskAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[GET] /tasks', async () => {

    const task1 = await taskFactory.makePrismaTask({
      title: 'Task 01',
      createdAt: new Date(2024, 1, 20)
    })
    const task2 = await taskFactory.makePrismaTask({
      title: 'Task 02',
      createdAt: new Date(2024, 1, 18)
    })

    const attachment1 = await attachmentFactory.makePrismaAttachment({
      title: "Attachment 1"
    })
    const attachment2 = await attachmentFactory.makePrismaAttachment({
      title: "Attachment 2"
    })

    await taskAttachmentFactory.makePrismaTaskAttachment({
      attachmentId: attachment1.id,
      taskId: task1.id
    })

    await taskAttachmentFactory.makePrismaTaskAttachment({
      attachmentId: attachment2.id,
      taskId: task2.id
    })

    const response = await request(app.getHttpServer())
      .get('/tasks?page=1')
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      tasks: expect.arrayContaining([
        expect.objectContaining({
          title: task1.title,
          attachments: [
            expect.objectContaining({
              title: 'Attachment 1',
            }),
          ],
        }),
        expect.objectContaining({
          title: task2.title,
          attachments: [
            expect.objectContaining({
              title: 'Attachment 2',
            }),
          ],
        }),
      ]),
    })
  })
})