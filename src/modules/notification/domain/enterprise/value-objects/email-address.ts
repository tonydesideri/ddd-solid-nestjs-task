import { ValueObject } from "core/entities/value-object";
import { Either, failure, success } from "core/types/either";
import { InvalidEmailAddressError } from "../errors/invalid-email-address-error";

interface EmailAddressProps {
  value: string
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  static instance(value: string): Either<InvalidEmailAddressError, EmailAddress> {
    if (!this.validateEmail(value)) {
      return failure(new InvalidEmailAddressError());
    }

    return success(new EmailAddress({ value }))
  }

  static validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  toString() {
    return this.props.value;
  }
}