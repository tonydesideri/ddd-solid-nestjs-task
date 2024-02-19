import { Either, failure, success } from "src/core/types/either"
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error"
import { Injectable } from "@nestjs/common"
import { IAttachmentsRepository } from "../repositories/attachments-repository.contract"
import { Attachment } from "src/domain/enterprise/attachment.entity"
import { Uploader } from "../storage/uploader.contract"


interface UploadAndCreateAttachmentRequest {
  fileName: string
  fileType: string
  body: Buffer,
}

type UploadAndCreateAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

type NewType = IAttachmentsRepository

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: NewType,
    private uploader: Uploader,
  ) { }

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return failure(new InvalidAttachmentTypeError(fileType))
    }

    const { path } = await this.uploader.upload({ fileName, body, })

    const attachment = Attachment.instance({
      title: fileName,
      path,
    })

    await this.attachmentsRepository.create(attachment)

    return success({
      attachment,
    })
  }
}