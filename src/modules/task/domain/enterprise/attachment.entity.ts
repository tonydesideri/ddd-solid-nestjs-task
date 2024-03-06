import { Entity } from 'core/entities/entity';
import { UniqueEntityID } from 'core/entities/unique-entity-id';

export interface AttachmentProps {
  title: string;
  path: string;
}

export class Attachment extends Entity<AttachmentProps> {
  static instance(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(
      {
        ...props,
      },
      id,
    );

    return attachment;
  }

  get title() {
    return this.props.title;
  }

  get path() {
    return this.props.path;
  }
}
