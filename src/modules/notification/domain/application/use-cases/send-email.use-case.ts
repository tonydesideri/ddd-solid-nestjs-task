import { Either, failure, success } from "core/types/either";
import { InvalidEmailAddressError } from "../../enterprise/errors/invalid-email-address-error";
import { Mail } from "../../enterprise/mail";
import { EmailAddress } from "../../enterprise/value-objects/email-address";
import { IMailService } from "../services/mail-service.contract";

interface SendEmailUseCaseRequest {
  sender: string;
  recipient: string;
  subject: string;
  body: string;
}

type SendEmailUseCaseResponse = Either<InvalidEmailAddressError, object>

export class SendEmailUseCase {
  constructor(private mailsService: IMailService) { }

  async execute({ body, recipient, sender, subject }: SendEmailUseCaseRequest): Promise<SendEmailUseCaseResponse> {
    const senderOrError = EmailAddress.instance(sender)
    if (senderOrError.isFailure()) {
      return failure(senderOrError.value)
    }

    const recipientOrError = EmailAddress.instance(recipient)
    if (recipientOrError.isFailure()) {
      return failure(recipientOrError.value)
    }

    const mail = Mail.instance({
      sender: senderOrError.value,
      recipient: recipientOrError.value,
      body,
      subject
    })

    this.mailsService.send(mail)

    return success({})
  }
}