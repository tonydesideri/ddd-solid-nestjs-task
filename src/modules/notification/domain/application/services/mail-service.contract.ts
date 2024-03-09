import { Mail } from "../../enterprise/mail";

export abstract class IMailService {
  abstract send(mail: Mail): void
}