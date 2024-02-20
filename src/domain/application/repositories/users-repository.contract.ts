import { User } from "src/domain/enterprise/user.entity";

export abstract class IUsersRepository {
  abstract findByName(name: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract create(data: User): Promise<void>
}