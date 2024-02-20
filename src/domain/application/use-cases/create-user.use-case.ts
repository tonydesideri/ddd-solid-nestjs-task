import { User } from "src/domain/enterprise/user.entity";
import { IUsersRepository } from "../repositories/users-repository.contract";
import { Either, failure, success } from "src/core/types/either";
import { ResourceExistsError } from "./errors/resource-exists-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type CreateUserUseCaseRequest = {
  name: string
  age: number,
  email: string
}

type CreateUserUseCaseRespose = Either<ResourceExistsError | ResourceNotFoundError, object>

export class CreateUserUseCase {
  constructor(private repository: IUsersRepository) { }
  async execute({ age, name, email }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseRespose> {
    const user = await this.repository.findByName(name)

    if (user) {
      return failure(new ResourceExistsError("Nome já existe"))
    }

    const userEmail = await this.repository.findByEmail(email)

    if (userEmail) {
      return failure(new ResourceNotFoundError("Email já existe"))
    }

    const newUser = User.instance({
      age,
      name,
      email
    })

    await this.repository.create(newUser)

    return success({})
  }
}