import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
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
  providers: [EnvService],
})
export class AppModule { }
