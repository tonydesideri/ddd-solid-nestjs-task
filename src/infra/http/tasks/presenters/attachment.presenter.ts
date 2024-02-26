import { Attachment } from "src/domain/tasks/enterprise/attachment.entity";

export class AttachmentPresenter {
  static toHTTP(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      path: attachment.path,
    }
  }
}
