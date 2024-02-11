import { BaseEntity } from 'src/core/entities/base-entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export interface TaskProps {
  title: string;
  description: string;
  isFavorite: boolean;
  status: 'DONE' | 'TODO' | 'DOING';
  createdAt: Date;
  updatedAt?: Date;
}

export class Task extends BaseEntity<TaskProps> {
  static instance(
    props: Optional<
      TaskProps,
      'isFavorite' | 'status' | 'createdAt' | 'updatedAt'
    >,
    id?: UniqueEntityID,
  ) {
    const task = new Task(
      {
        ...props,
        isFavorite: props.isFavorite ?? false,
        status: props.status ?? 'TODO',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return task;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get isFavorite() {
    return this.props.isFavorite;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  /**
   * Exemplo de um getter que não é uma propriedade mas que pode ver exposto pela classe
   * É parecido como um campo virtual
   */
  get excerpt() {
    return this.props.description.substring(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(value: string) {
    this.props.title = value;
    this.touch();
  }

  set description(value: string) {
    this.props.description = value;
  }

  set isFavorite(value: boolean) {
    this.props.isFavorite = value;
    this.touch();
  }

  set status(value: 'DONE' | 'TODO' | 'DOING') {
    this.props.status = value;
    this.touch();
  }
}
