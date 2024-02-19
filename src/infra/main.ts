import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
