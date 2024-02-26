import { IAttachmentsRepository } from "src/domain/tasks/application/repositories/attachments-repository.contract"
import { Attachment } from "src/domain/tasks/enterprise/attachment.entity"

export class InMemoryAttachmentsRepositoryImpl implements IAttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}