import { Module } from "@nestjs/common";
import { OnTaskChangedIsFavorite } from "../../domain/application/subscribers/on-task-changed-is-favorite.sub";
import { SendEmailUseCase } from "../../domain/application/use-cases/send-email.use-case";
import { MailsServiceImpl } from "../services/mail/mail.service";
import { ServicesModule } from "../services/services.module";

@Module({
  imports: [ServicesModule],
  providers: [
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
})
export class EventsModule { }