import { DomainEvents } from "core/events/domain-events";
import { EventHandler } from "core/events/event-handler";
import { TaskChangedIsFavorite } from "src/modules/task/domain/events/task-changed-is-favorite.event";
import { SendEmailUseCase } from "../use-cases/send-email.use-case";

export class OnTaskChangedIsFavorite implements EventHandler {
  constructor(private sendEmailUseCase: SendEmailUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendChageTaskIsFavoriteEmail.bind(this),
      TaskChangedIsFavorite.name)
  }

  private async sendChageTaskIsFavoriteEmail({ task }: TaskChangedIsFavorite) {
    await this.sendEmailUseCase.execute({
      sender: "tony@icts.com.br",
      recipient: "dean@icts.com.br",
      subject: `A tareda com o titulo ${task.title} for favoritada`,
      body: task.excerpt
    })
  }
}