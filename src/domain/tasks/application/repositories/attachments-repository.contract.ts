import { Attachment } from "src/domain/tasks/enterprise/attachment.entity";

export abstract class IAttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>
}