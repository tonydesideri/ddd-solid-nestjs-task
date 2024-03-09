import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { PersistenceModule } from 'src/modules/task/infra/persistence/persistence.module';
import { TaskFactory } from 'test/factories/make-task.factory';
import { vi } from 'vitest';
import { OnTaskChangedIsFavorite } from '../../domain/application/subscribers/on-task-changed-is-favorite.sub';
import { SendEmailUseCase } from '../../domain/application/use-cases/send-email.use-case';
import { MailsServiceImpl } from '../services/mail/mail.service';
import { ServicesModule } from '../services/services.module';

describe('Change Favorite Task with valdiade mail send (e2e)', () => {
  let app: INestApplication;
  let taskFactory: TaskFactory;
  let sendEmailUseCase: SendEmailUseCase

  let sendEmailUseCaseExecuteSpy

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, PersistenceModule, ServicesModule],
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

    // TODO: Concluir estes teste

    // await request(app.getHttpServer())
    //   .patch(`/tasks/${taskId}`)
    //   .send();

    // await waitFor(() => {
    //   expect(sendEmailUseCaseExecuteSpy).toHaveBeenCalled()
    // })
  });
});
