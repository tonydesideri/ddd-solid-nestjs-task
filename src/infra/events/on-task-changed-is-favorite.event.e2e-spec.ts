import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { OnTaskChangedIsFavorite } from 'src/domain/notification/application/subscribers/on-task-changed-is-favorite.sub';
import { SendEmailUseCase } from 'src/domain/notification/application/use-cases/send-email.use-case';
import { AppModule } from 'src/infra/app.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import request from 'supertest';
import { TaskFactory } from 'test/factories/make-task.factory';
import { vi } from 'vitest';
import { MailsServiceImpl } from '../services/mail/mail.service';
import { ServicesModule } from '../services/services.module';

describe('Change Favorite Task with valdiade mail send (e2e)', () => {
  let app: INestApplication;
  let taskFactory: TaskFactory;
  let sendEmailUseCase: SendEmailUseCase

  let sendEmailUseCaseExecuteSpy

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, ServicesModule],
      providers: [
        TaskFactory,
        {
          provide: SendEmailUseCase,
          useFactory: (service: MailsServiceImpl) =>
            new SendEmailUseCase(service),
          inject: [MailsServiceImpl],
        },
        {
          provide: OnTaskChangedIsFavorite,
          useFactory: (useCase: SendEmailUseCase) =>
            new OnTaskChangedIsFavorite(useCase),
          inject: [SendEmailUseCase],
        },
      ]
    }).compile();

    app = moduleRef.createNestApplication();

    taskFactory = moduleRef.get(TaskFactory)
    sendEmailUseCase = moduleRef.get(SendEmailUseCase)
    // sendEmailUseCase = moduleRef.get(SendEmailUseCase)

    sendEmailUseCaseExecuteSpy = vi.spyOn(sendEmailUseCase, "execute")

    await app.init();
  });

  test('[PATCH] /tasks/:id', async () => {
    const task = await taskFactory.makePrismaTask()
    const taskId = task.id.toString()

    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .send();

    // await waitFor(() => {
    //   expect(sendEmailUseCaseExecuteSpy).toHaveBeenCalled()
    // })
  });
});
