import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../database/entities/category.entity';
import { Decoration } from '../database/entities/decoration.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Decoration])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
