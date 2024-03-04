import { Mail } from "../../enterprise/mail";

export abstract class IMailsService {
  abstract send(mail: Mail): void
}