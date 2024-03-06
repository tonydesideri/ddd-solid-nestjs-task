import { UseCaseError } from "core/errors/use-case-error.contract";

export class NotAllowedError extends Error implements UseCaseError {
  constructor(message: string = 'Not allowed') {
    super(message);
  }
}
