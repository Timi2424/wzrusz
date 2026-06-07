import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';

@Module({
  imports: [DatabaseModule, CatalogModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
