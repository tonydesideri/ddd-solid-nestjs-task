import { IAttachmentsRepository } from "src/modules/task/domain/application/repositories/attachments-repository.contract"
import { Attachment } from "src/modules/task/domain/enterprise/attachment.entity"

export class InMemoryAttachmentsRepositoryImpl implements IAttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}