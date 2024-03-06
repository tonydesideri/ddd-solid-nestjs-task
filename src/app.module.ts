import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { EnvModule } from 'src/common/env/env.module';
import { EnvService } from 'src/common/env/env.service';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { ValidationExceptionFilter } from 'src/common/exception/validation-exception.filter';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { EventsModule } from './modules/notification/infra/events/events.module';
import { HttpModule } from './modules/task/infra/http/http.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', '..', 'uploads'),
    }),
    EnvModule,
    HttpModule,
    EventsModule
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
