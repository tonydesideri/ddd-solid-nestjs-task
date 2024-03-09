import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment.factory';
import { TaskFactory } from 'test/factories/make-task.factory';

describe('Create Comment (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory
  let taskFactory: TaskFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AttachmentFactory, TaskFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    taskFactory = moduleRef.get(TaskFactory)

    await app.init();
  });

  test('[POST] /comments', async () => {
    const task1 = await taskFactory.makePrismaTask()

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer()).post('/comments').send({
      taskId: task1.id.toString(),
      content: 'Conteudo do comentario',
      attachmentsIds: [
        attachment1.id.toString(),
        attachment2.id.toString()
      ]
    });

    expect(response.statusCode).toBe(201);

    const commentOnDatabase = await prisma.comment.findMany({
      where: {
        taskId: task1.id.toString(),
      },
      include: {
        attachments: true
      }
    });

    expect(commentOnDatabase).toHaveLength(1);

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        commentId: commentOnDatabase[0].id
      }
    });

    expect(attachmentOnDatabase).toHaveLength(2);
  });

  test('[POST] /comments with task not exist', async () => {
    const response = await request(app.getHttpServer()).post('/comments').send({
      taskId: "task-qualquer",
      content: 'Conteudo do comentario',
      attachmentsIds: []
    });

    expect(response.statusCode).toBe(404);
  });
});
