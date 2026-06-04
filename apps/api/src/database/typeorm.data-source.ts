/**
 * TypeORM CLI entry (run-migrations.ts).
 * Migrations: glob on ./migrations — no per-file imports.
 */
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { loadEnvFiles } from '../env/load-env';
import { Category } from './entities/category.entity';
import { Decoration } from './entities/decoration.entity';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryLineItem } from './entities/inquiry-line-item.entity';

export function buildCliDataSourceOptions(): DataSourceOptions {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      'DATABASE_URL is required for migrations. Use .env (see .env.example) or export DATABASE_URL.',
    );
  }

  const needsSsl =
    url.includes('sslmode=require') || url.includes('sslmode=verify-full');

  return {
    type: 'postgres',
    url,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    entities: [Category, Decoration, Inquiry, InquiryLineItem],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
  };
}

export function createMigrationDataSource(): DataSource {
  loadEnvFiles();
  return new DataSource(buildCliDataSourceOptions());
}
