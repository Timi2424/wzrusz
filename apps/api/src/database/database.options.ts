import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolvePostgresConnection } from './database.connection';

export function buildTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    ...resolvePostgresConnection(),
    autoLoadEntities: true,
    synchronize: false,
  };
}
