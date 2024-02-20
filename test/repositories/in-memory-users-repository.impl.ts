import { IUsersRepository } from "src/domain/application/repositories/users-repository.contract";
import { User } from "src/domain/enterprise/user.entity";

export class InMemoryUsersRepositoryImpl implements IUsersRepository {
  public items: User[] = []

  async findByName(name: string): Promise<User | null> {
    const user = this.items.find(item => item.name === name)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: User): Promise<void> {
    this.items.push(data);
  }
}