import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Mail, MailProps } from "src/domain/notification/enterprise/mail";
import { EmailAddress } from "src/domain/notification/enterprise/value-objects/email-address";

export function makeMail(
  override: Partial<MailProps> = {},
  id?: UniqueEntityID,
) {
  const senderOrError = EmailAddress.instance(faker.internet.email())
  if (senderOrError.isFailure()) {
    throw new Error("E-mail inválido")
  }

  const recipientOrError = EmailAddress.instance(faker.internet.email())
  if (recipientOrError.isFailure()) {
    throw new Error("E-mail inválido")
  }

  const mail = Mail.instance(
    {
      sender: senderOrError.value,
      recipient: recipientOrError.value,
      subject: faker.lorem.sentence(5),
      body: faker.lorem.sentence({ min: 10, max: 50 }),
      ...override,
    },
    id,
  );

  return mail;
}