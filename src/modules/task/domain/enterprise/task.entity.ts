import { AggregateRoot } from 'core/entities/aggregate-root';
import { UniqueEntityID } from 'core/entities/unique-entity-id';
import { Optional } from 'core/types/optional';
import { TaskChangedIsFavorite } from '../events/task-changed-is-favorite.event';
import { TaskAttachmentList } from './task-attachment-list.entity';

export interface TaskProps {
  title: string;
  description: string;
  isFavorite: boolean;
  status: 'DONE' | 'TODO' | 'DOING';
  attachments: TaskAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Task extends AggregateRoot<TaskProps> {
  static instance(
    props: Optional<
      TaskProps,
      'isFavorite' | 'status' | 'createdAt' | 'updatedAt' | 'attachments'
    >,
    id?: UniqueEntityID,
  ) {
    const task = new Task(
      {
        ...props,
        isFavorite: props.isFavorite ?? false,
        status: props.status ?? 'TODO',
        attachments: props.attachments ?? new TaskAttachmentList(),
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

  get attachments() {
    return this.props.attachments;
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
    this.props.title = value.toUpperCase();
    this.touch();
  }

  set description(value: string) {
    this.props.description = value;
    this.touch();
  }

  set isFavorite(value: boolean) {
    this.props.isFavorite = value;

    if (value) {
      this.addDomainEvent(new TaskChangedIsFavorite(this))
    }

    this.touch();
  }

  set status(value: 'DONE' | 'TODO' | 'DOING') {
    this.props.status = value;
    this.touch();
  }

  set attachments(value: TaskAttachmentList) {
    this.props.attachments = value;
    this.touch();
  }
}
