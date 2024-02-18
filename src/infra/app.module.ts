import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { HttpModule } from './http/http.module';

@Module({
  imports: [EnvModule, HttpModule],
  controllers: [],
  providers: [EnvService],
})
export class AppModule {}
