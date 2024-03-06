import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvService } from 'common/env/env.service';
import { HttpExceptionFilter } from 'common/exception/http-exception.filter';
import { PrismaExceptionFilter } from 'common/exception/prisma-exception.filter';
import { ValidationExceptionFilter } from 'common/exception/validation-exception.filter';
import { ValidationException } from 'common/exception/validation.exeption';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (errors: any) => {
        const exceptions = errors.map((error) => {
          return Object.values(error.constraints).join('');
        });
        return new ValidationException(exceptions);
      },
    })
  );

  app.useGlobalFilters(
    new PrismaExceptionFilter(),
  );

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
