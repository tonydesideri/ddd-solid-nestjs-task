import { IMailsService } from "src/modules/notification/domain/application/services/mails-service.contract"
import { Mail } from "src/modules/notification/domain/enterprise/mail"

export class FakeMailServiceImpl implements IMailsService {
  public items: Mail[] = []

  send(mail: Mail): void {
    this.items.push(mail)
  }
}