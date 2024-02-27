import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { EnvModule } from './common/env/env.module';
import { EnvService } from './common/env/env.service';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ValidationExceptionFilter } from './common/exception/validation-exception.filter';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', '..', 'uploads'),
    }),
    EnvModule,
    HttpModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    EnvService],
})
export class AppModule { }
