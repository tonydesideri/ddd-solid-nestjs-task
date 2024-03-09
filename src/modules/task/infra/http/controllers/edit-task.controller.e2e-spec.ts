import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment.factory';
import { TaskAttachmentFactory } from 'test/factories/make-task-attachment.factory';
import { TaskFactory } from 'test/factories/make-task.factory';

describe('Edit Task (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let taskFactory: TaskFactory
  let taskAttachmentFactory: TaskAttachmentFactory
  let attachmentFactory: AttachmentFactory


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TaskFactory, TaskAttachmentFactory, AttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    taskFactory = moduleRef.get(TaskFactory)
    taskAttachmentFactory = moduleRef.get(TaskAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init();
  });

  test('[PUT] /tasks/:id', async () => {
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const task = await taskFactory.makePrismaTask()

    await taskAttachmentFactory.makePrismaTaskAttachment({
      attachmentId: attachment1.id,
      taskId: task.id
    })

    await taskAttachmentFactory.makePrismaTaskAttachment({
      attachmentId: attachment2.id,
      taskId: task.id
    })

    const taskId = task.id.toString()
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send({
        title: 'Edit Title',
        description: 'Edit Description',
        attachmentsIds: [
          attachment1.id.toString(),
          attachment3.id.toString()
        ]
      });

    expect(response.statusCode).toBe(204);

    const taskOnDatabase = await prisma.task.findFirst({
      where: {
        title: 'EDIT TITLE',
        description: 'Edit Description',
      },
    });

    expect(taskOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        taskId: taskOnDatabase.id,
      },
    });

    expect(attachmentOnDatabase).toHaveLength(2);
    expect(attachmentOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString()
        }),
        expect.objectContaining({
          id: attachment3.id.toString()
        })
      ])
    )
  });

  test('[PUT] /tasks/:id not exists', async () => {
    await taskFactory.makePrismaTask()

    const response = await request(app.getHttpServer())
      .put(`/tasks/taskid-qualquer`)
      .send({
        title: 'Edit Title',
        description: 'Edit Description',
      });

    expect(response.statusCode).toBe(404);
  });
});
