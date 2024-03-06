import { UseCaseError } from "src/core/errors/use-case-error.contract";

export class ResourceExistsError extends Error implements UseCaseError {
  constructor(message: string = 'Resource exists') {
    super(message);
  }
}
