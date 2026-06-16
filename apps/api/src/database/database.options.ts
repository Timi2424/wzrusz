import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolvePostgresConnection } from './database.connection';
import {
  Category,
  Decoration,
  Inquiry,
  InquiryLineItem,
  ScheduleEvent,
  ScheduleEventLineItem,
  User,
} from './entities';

export function buildTypeOrmOptions(): TypeOrmModuleOptions {
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
    autoLoadEntities: true,
    synchronize: false,
  };
}
