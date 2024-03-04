import { Either, failure, success } from "src/core/types/either";
import { InvalidEmailAddressError } from "../../enterprise/errors/invalid-email-address-error";
import { Mail } from "../../enterprise/mail";
import { EmailAddress } from "../../enterprise/value-objects/email-address";
import { IMailsService } from "../services/mails-service.contract";

interface SendEmailUseCaseRequest {
  sender: string;
  recipient: string;
  subject: string;
  body: string;
}

type SendEmailUseCaseResponse = Either<InvalidEmailAddressError, object>

export class SendEmailUseCase {
  constructor(private mailsService: IMailsService) { }

  async execute({ body, recipient, sender, subject }: SendEmailUseCaseRequest): Promise<SendEmailUseCaseResponse> {
    const senderOrError = EmailAddress.instance(sender)
    if (senderOrError.isFailure()) {
      // TODO: Quando ocorrido erro em um evento, tratar na camada onde o evento é executado
      return failure(senderOrError.value)
    }

    const recipientOrError = EmailAddress.instance(recipient)
    if (recipientOrError.isFailure()) {
      // TODO: Quando ocorrido erro em um evento, tratar na camada onde o evento é executado
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