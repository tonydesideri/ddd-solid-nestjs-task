import { InMemoryUsersRepositoryImpl } from "test/repositories/in-memory-users-repository.impl"
import { CreateUserUseCase } from "./create-user.use-case"
import { User } from "src/domain/enterprise/user.entity"
import { ResourceExistsError } from "./errors/resource-exists-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { makeUser } from "test/factories/make-user.factory"

describe("Create User", () => {
  let InMemoryUserssRepositoryImpl: InMemoryUsersRepositoryImpl
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    InMemoryUserssRepositoryImpl = new InMemoryUsersRepositoryImpl()
    createUserUseCase = new CreateUserUseCase(InMemoryUserssRepositoryImpl)
  })

  it("should be create an user", async () => {
    const user = {
      age: 50,
      name: "Tony",
      email: "tony@email.com"
    }

    // Execução
    const result = await createUserUseCase.execute(user)

    //O esperado / Teste
    expect(result.isSuccess()).toBe(true)
    expect(InMemoryUserssRepositoryImpl.items).toHaveLength(1)
    expect(InMemoryUserssRepositoryImpl.items[0].age).toEqual(50)
  })

  it("should be note create an user with name", async () => {
    const user = makeUser()
    InMemoryUserssRepositoryImpl.create(user)

    const result = await createUserUseCase.execute(user)

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceExistsError)
  })

  it("should be note create an user with email", async () => {
    const user = makeUser()
    InMemoryUserssRepositoryImpl.create(user)

    const result = await createUserUseCase.execute({
      age: user.age,
      email: user.email,
      name: "New Name"
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})