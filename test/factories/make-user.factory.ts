import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { User, UserProps } from "src/domain/enterprise/user.entity";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const task = User.instance(
    {
      age: faker.number.int(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      ...override,
    },
    id,
  );

  return task;
}