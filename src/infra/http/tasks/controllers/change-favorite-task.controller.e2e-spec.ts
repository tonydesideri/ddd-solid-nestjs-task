import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { AppModule } from 'src/infra/app.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { TaskFactory } from 'test/factories/make-task.factory';

describe('Change Favorite Task (e2e)', () => {
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

  test('[PATCH] /tasks/:id', async () => {
    const task = await taskFactory.makePrismaTask()
    const taskId = task.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .send();

    expect(response.statusCode).toBe(204);

    const taskOnDatabase = await prisma.task.findUnique({
      where: {
        id: taskId
      },
    });

    expect(taskOnDatabase.isFavorite).toEqual(true);
  });

  test('[PATCH] /tasks/:id not exists', async () => {
    await taskFactory.makePrismaTask()

    const response = await request(app.getHttpServer())
      .patch(`/tasks/taskid-qualquer`)
      .send();

    expect(response.statusCode).toBe(404);
  });
});
