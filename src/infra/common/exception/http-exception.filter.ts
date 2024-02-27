import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const error = status === HttpStatus.INTERNAL_SERVER_ERROR
      ? (exception.getResponse() as { error: string, message: string }).message
      : (exception.getResponse() as { error: string }).error

    const message = [
      `${status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message
        : 'Ocorreu um erro interno do servidor.'
      }`,
    ]

    const errorResponse = {
      statusCode: status,
      message,
      error,
      filds: null
    };

    return response.status(status).json(errorResponse);
  }
}
