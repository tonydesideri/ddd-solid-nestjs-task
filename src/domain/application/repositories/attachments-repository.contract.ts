import { Attachment } from "src/domain/enterprise/attachment.entity";

export abstract class IAttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
}