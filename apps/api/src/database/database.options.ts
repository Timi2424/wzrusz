import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolvePostgresConnection } from './database.connection';
import {
  Category,
  Decoration,
  Inquiry,
  InquiryLineItem,
  User,
} from './entities';

export function buildTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    ...resolvePostgresConnection(),
    entities: [Category, Decoration, Inquiry, InquiryLineItem, User],
    autoLoadEntities: true,
    synchronize: false,
  };
}
