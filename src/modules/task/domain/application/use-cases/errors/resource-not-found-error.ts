import { UseCaseError } from "src/core/errors/use-case-error.contract";


export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(message: string = 'Resource not found') {
    super(message);
  }
}
