import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IMailService } from 'src/modules/notification/domain/application/services/mail-service.contract';
import { Mail } from 'src/modules/notification/domain/enterprise/mail';

@Injectable()
export class MailsServiceImpl implements IMailService {
  constructor(private readonly mailerService: MailerService) { }

  async send(mail: Mail): Promise<void> {
    await this.mailerService.sendMail({
      from: mail.sender.toString(),
      to: mail.recipient.toString(),
      subject: mail.subject,
      text: mail.body,
    });
  }
}
