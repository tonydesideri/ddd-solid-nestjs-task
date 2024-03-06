import { UniqueEntityID } from "core/entities/unique-entity-id"
import { ChangeFavoriteTaskUseCase } from "src/modules/task/domain/application/use-cases/change-favorite-task.use-case"
import { InMemoryRepositoriesProps, makeInMemoryRepositories } from "test/factories/make-in-memory-repositories.factory"
import { makeTask } from "test/factories/make-task.factory"
import { FakeMailServiceImpl } from "test/services/fake-mail-service.impl"
import { waitFor } from "test/utils/wait-for"
import { SendEmailUseCase } from "../use-cases/send-email.use-case"
import { OnTaskChangedIsFavorite } from "./on-task-changed-is-favorite.sub"

describe("OnTaskChangedIsFavorite", () => {
  let mailsService: FakeMailServiceImpl
  let sendEmailUseCase: SendEmailUseCase
  let inMemory: InMemoryRepositoriesProps;
  let changeFavoriteTaskUseCase: ChangeFavoriteTaskUseCase;

  let sendEmailUseCaseExecuteSpy

  beforeEach(() => {
    mailsService = new FakeMailServiceImpl()
    sendEmailUseCase = new SendEmailUseCase(mailsService)
    inMemory = makeInMemoryRepositories()
    changeFavoriteTaskUseCase = new ChangeFavoriteTaskUseCase(
      inMemory.TasksRepository,
    );

    sendEmailUseCaseExecuteSpy = vi.spyOn(sendEmailUseCase, "execute")

    new OnTaskChangedIsFavorite(sendEmailUseCase)
  })

  it("shoud send e-mail when task is favorite", async () => {
    // Arrange
    const newTask = makeTask(
      {
        isFavorite: false,
      },
      new UniqueEntityID('task-1'),
    );
    await inMemory.TasksRepository.create(newTask);

    // Act
    await changeFavoriteTaskUseCase.execute({ taskId: 'task-1' });

    await waitFor(() => {
      expect(sendEmailUseCaseExecuteSpy).toHaveBeenCalled()
    })
  })
})