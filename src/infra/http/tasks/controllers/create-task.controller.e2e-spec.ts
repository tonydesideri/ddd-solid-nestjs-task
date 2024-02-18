import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { AppModule } from 'src/infra/app.module';

describe('Create Task (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /tasks', async () => {
    const response = await request(app.getHttpServer()).post('/tasks').send({
      title: 'Title',
      description: 'Description',
    });

    expect(response.statusCode).toBe(201);

    const taskOnDatabase = await prisma.task.findFirst({
      where: {
        title: 'Title',
      },
    });

    expect(taskOnDatabase).toBeTruthy();
  });
});
