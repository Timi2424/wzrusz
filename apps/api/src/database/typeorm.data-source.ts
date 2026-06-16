/**
 * TypeORM CLI entry (run-migrations.ts).
 * Migrations: glob on ./migrations — no per-file imports.
 */
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { resolvePostgresConnection } from './database.connection';
import { loadEnvFiles } from '../env/load-env';
import { Category } from './entities/category.entity';
import { Decoration } from './entities/decoration.entity';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryLineItem } from './entities/inquiry-line-item.entity';
import { ScheduleEvent } from './entities/schedule-event.entity';
import { ScheduleEventLineItem } from './entities/schedule-event-line-item.entity';
import { User } from './entities/user.entity';

export function buildCliDataSourceOptions(): DataSourceOptions {
  return {
    ...resolvePostgresConnection(),
    entities: [
      Category,
      Decoration,
      Inquiry,
      InquiryLineItem,
      ScheduleEvent,
      ScheduleEventLineItem,
      User,
    ],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
  };
}

export function createMigrationDataSource(): DataSource {
  loadEnvFiles();
  return new DataSource(buildCliDataSourceOptions());
}
