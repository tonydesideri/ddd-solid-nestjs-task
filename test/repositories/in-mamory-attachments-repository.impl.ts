import { IAttachmentsRepository } from "src/domain/application/repositories/attachments-repository.contract"
import { Attachment } from "src/domain/enterprise/attachment.entity"

export class InMemoryAttachmentsRepository implements IAttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}