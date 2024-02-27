import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { EnvService } from './common/env/env.service';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { PrismaExceptionFilter } from './common/exception/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );
  app.useGlobalFilters(
    new PrismaExceptionFilter(),
  );

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
