import { EntityError } from "core/errors/entity-error.contract";

export class InvalidEmailAddressError extends Error implements EntityError {
  constructor(message: string = 'Endereço de e-mail inválido') {
    super(message);
  }
}
