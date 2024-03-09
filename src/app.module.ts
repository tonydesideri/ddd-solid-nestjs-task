import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EnvModule } from 'common/env/env.module';
import { EnvService } from 'common/env/env.service';
import { HttpExceptionFilter } from 'common/exception/http-exception.filter';
import { ValidationExceptionFilter } from 'common/exception/validation-exception.filter';
import { LoggingInterceptor } from 'common/interceptor/logging.interceptor';
import * as path from 'path';
import { NotificationModule } from './modules/notification/notification.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', '..', 'uploads'),
    }),
    EnvModule,
    TaskModule,
    NotificationModule
  ],
  controllers: [],
  providers: [
    EnvService,
    {
      provide: APP_PIPE,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
})
export class AppModule { }
