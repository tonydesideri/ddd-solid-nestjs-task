import { UniqueEntityID } from "core/entities/unique-entity-id";
import { DomainEvent } from "core/events/domain-event";
import { Task } from "../enterprise/task.entity";

export class TaskChangedIsFavorite implements DomainEvent {
  public ocurredAt: Date;
  public task: Task

  constructor(task: Task) {
    this.ocurredAt = new Date()
    this.task = task
  }

  getAggregateId(): UniqueEntityID {
    return this.task.id
  }
}