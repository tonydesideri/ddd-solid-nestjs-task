import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      message: [
        `${status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message
          : 'Ocorreu um erro interno do servidor.'
        }`,
      ],
    };

    return response.status(status).json(errorResponse);
  }
}
