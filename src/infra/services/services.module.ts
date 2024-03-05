import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailsServiceImpl } from './mail/mail.service';


@Module({
  imports: [
    // TODO: Criar variáveis
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io', // Coloque o host do seu servidor SMTP
        port: 2525, // Coloque a porta do seu servidor SMTP
        secure: false, // Define se é uma conexão segura (SSL/TLS) ou não
        auth: {
          user: '5068c1a351658e', // Coloque o usuário do seu e-mail
          pass: '606d208abd1a2e', // Coloque a senha do seu e-mail
        },
      },
    }),
  ],
  providers: [MailsServiceImpl],
  exports: [MailsServiceImpl],
})
export class ServicesModule { }