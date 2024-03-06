import { Entity } from "core/entities/entity";
import { UniqueEntityID } from "core/entities/unique-entity-id";
import { EmailAddress } from "./value-objects/email-address";

export interface MailProps {
  sender: EmailAddress;
  recipient: EmailAddress;
  subject: string;
  body: string;
}

export class Mail extends Entity<MailProps> {
  static instance(props: MailProps, id?: UniqueEntityID) {
    const mail = new Mail(props, id)

    return mail
  }

  get sender() {
    return this.props.sender
  }

  get recipient() {
    return this.props.recipient
  }

  get subject() {
    return this.props.subject
  }

  get body() {
    return this.props.body
  }
}