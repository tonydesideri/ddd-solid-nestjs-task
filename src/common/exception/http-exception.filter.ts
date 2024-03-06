import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { ip } = request;
    const userAgent = request.get('user-agent') || '';

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let error = ""
    if (exception instanceof HttpException) {
      error = status === HttpStatus.INTERNAL_SERVER_ERROR
        ? (exception.getResponse() as { error: string, message: string }).message
        : (exception.getResponse() as { error: string }).error
    } else {
      error = (exception as any).name
    }

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

    this.logger.error(
      `${request.method} ${status} ${request.path} - ${userAgent} ${ip}`,
      'HttpExceptionFilter'
    );

    return response.status(status).json(errorResponse);
  }
}
