import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infra/database/prisma/prisma.service';
import { EnvModule } from './infra/env/env.module';
import { EnvService } from './infra/env/env.service';

@Module({
  imports: [EnvModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, EnvService],
})
export class AppModule { }
