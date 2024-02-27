import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorMessage = this.getErrorMessage(exception);
    const status = this.getHttpStatus(exception);
    const fieldName = this.getFieldName(exception);

    response.status(status).json({
      statusCode: status,
      message: [errorMessage],
      fields: fieldName, // Incluindo o campo específico, se disponível
    });
  }

  private getErrorMessage(exception: Prisma.PrismaClientKnownRequestError): string {
    switch (exception.code) {
      case 'P2000':
        return 'O valor fornecido para o campo é muito longo.';
      case 'P2002':
        return 'Já existe uma entrada com o mesmo valor para o campo único.';
      case 'P2025':
        return 'O recurso solicitado não foi encontrado.';
      default:
        return 'Ocorreu um erro interno do servidor.';
    }
  }

  private getHttpStatus(exception: Prisma.PrismaClientKnownRequestError): HttpStatus {
    switch (exception.code) {
      case 'P2000':
        return HttpStatus.BAD_REQUEST;
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getFieldName(exception: Prisma.PrismaClientKnownRequestError): string | null | unknown {
    if ('meta' in exception && 'target' in exception.meta) {
      return exception.meta.target;
    }
    return null;
  }
}
