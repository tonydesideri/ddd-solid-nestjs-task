import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

export interface UserProps {
  name: string;
  age: number;
  email: string
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  static instance(
    props: Optional<
      UserProps,
      'createdAt' | 'updatedAt'
    >,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null
      },
      id,
    );

    return user;
  }

  get name() {
    return this.props.name;
  }

  get age() {
    return this.props.age;
  }

  get email() {
    return this.props.email;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  set age(value: number) {
    this.props.age = value;
    this.touch();
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
  }
}
