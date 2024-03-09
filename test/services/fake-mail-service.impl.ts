import { IMailService } from "src/modules/notification/domain/application/services/mail-service.contract"
import { Mail } from "src/modules/notification/domain/enterprise/mail"

export class FakeMailServiceImpl implements IMailService {
  public items: Mail[] = []

  send(mail: Mail): void {
    this.items.push(mail)
  }
}