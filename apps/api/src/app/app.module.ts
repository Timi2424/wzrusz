import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CatalogModule } from '../catalog/catalog.module';
import { DatabaseModule } from '../database/database.module';
import { InquiryModule } from '../inquiry/inquiry.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';

@Module({
  imports: [DatabaseModule, AuthModule, CatalogModule, InquiryModule, SchedulerModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
