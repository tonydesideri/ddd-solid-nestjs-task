import { Attachment } from "src/modules/task/domain/enterprise/attachment.entity";

export abstract class IAttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
}