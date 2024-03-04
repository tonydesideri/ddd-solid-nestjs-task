import { makeMail } from "test/factories/make-mail.factory"
import { FakeMailServiceImpl } from "test/services/fake-mail-service.impl"
import { InvalidEmailAddressError } from "../../enterprise/errors/invalid-email-address-error"
import { SendEmailUseCase } from "./send-email.use-case"

describe("Send Email Use Case", () => {
  let mailsServie: FakeMailServiceImpl
  let sendEmailUseCase: SendEmailUseCase

  beforeEach(() => {
    mailsServie = new FakeMailServiceImpl()
    sendEmailUseCase = new SendEmailUseCase(mailsServie)
  })

  it("Shoud be send e-mail", async () => {
    const mail = makeMail()

    const result = await sendEmailUseCase.execute({
      sender: mail.sender.toString(),
      recipient: mail.recipient.toString(),
      subject: mail.subject,
      body: mail.body
    })

    expect(result.isSuccess())
    expect(mailsServie.items.length).toBe(1)
  })

  it("Shoud be send e-mail when e-mail invalid", async () => {
    const mail = makeMail()

    const result = await sendEmailUseCase.execute({
      sender: "Email errado",
      recipient: mail.recipient.toString(),
      subject: mail.subject,
      body: mail.body
    })

    expect(result.isFailure())
    expect(result.value).toBeInstanceOf(InvalidEmailAddressError)
  })
})