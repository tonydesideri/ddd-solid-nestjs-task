import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { AppModule } from 'src/infra/app.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { TaskFactory } from 'test/factories/make-task.factory';

describe('Edit Task (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let taskFactory: TaskFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TaskFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    taskFactory = moduleRef.get(TaskFactory)

    await app.init();
  });

  test('[PUT] /tasks/:id', async () => {
    const task = await taskFactory.makePrismaTask()
    const taskId = task.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send({
        title: 'Edit Title',
        description: 'Edit Description',
      });

    expect(response.statusCode).toBe(204);

    const taskOnDatabase = await prisma.task.findMany({
      where: {
        title: 'EDIT TITLE',
        description: 'Edit Description',
      },
    });

    expect(taskOnDatabase).toBeTruthy();
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
