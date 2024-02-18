import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { AppModule } from 'src/infra/app.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { TaskFactory } from 'test/factories/make-task.factory';

describe('Delete Task (e2e)', () => {
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

  test('[DELETE] /tasks/:id', async () => {
    const task = await taskFactory.makePrismaTask()
    const taskId = task.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .send();

    expect(response.statusCode).toBe(204);

    const taskOnDatabase = await prisma.task.findUnique({
      where: {
        id: taskId
      },
    });

    expect(taskOnDatabase).toBeNull();
  });

  test('[DELETE] /tasks/:id not exists', async () => {
    await taskFactory.makePrismaTask()

    const response = await request(app.getHttpServer())
      .put(`/tasks/taskid-qualquer`)
      .send();

    expect(response.statusCode).toBe(404);
  });
});
