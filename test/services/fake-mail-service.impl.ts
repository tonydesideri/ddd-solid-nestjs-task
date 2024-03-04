import { IMailsService } from "src/domain/notification/application/services/mails-service.contract";
import { Mail } from "src/domain/notification/enterprise/mail";

export class FakeMailServiceImpl implements IMailsService {
  public items: Mail[] = []

  send(mail: Mail): void {
    this.items.push(mail)
  }
}