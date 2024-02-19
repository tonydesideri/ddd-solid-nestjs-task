import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

interface AttachmentProps {
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
