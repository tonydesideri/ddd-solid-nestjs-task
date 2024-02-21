import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { AppModule } from 'src/infra/app.module';
import { AttachmentFactory } from 'test/factories/make-attachment.factory';
import { DatabaseModule } from 'src/infra/database/database.module';

describe('Create Task (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    attachmentFactory = moduleRef.get(AttachmentFactory);

    await app.init();
  });

  test('[POST] /tasks', async () => {
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer()).post('/tasks').send({
      title: 'Title',
      description: 'Description',
      attachmentsIds: [
        attachment1.id.toString(),
        attachment2.id.toString()
      ]
    });

    expect(response.statusCode).toBe(201);

    const taskOnDatabase = await prisma.task.findFirst({
      where: {
        title: 'Title',
      },
    });

    expect(taskOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        taskId: taskOnDatabase.id,
      },
    });

    expect(attachmentOnDatabase).toHaveLength(2);
  });
});
