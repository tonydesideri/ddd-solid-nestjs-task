import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common';
import { ValidationException } from './validation.exeption';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter<ValidationException> {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    console.log("Erro de validação")

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      message: exception.validationErrors,
      error: exception.message,
      filds: null
    };

    return response.status(status).json(errorResponse);
  }
}
