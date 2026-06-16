import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Decoration } from './decoration.entity';
import { ScheduleEvent } from './schedule-event.entity';

@Entity('schedule_event_line_items')
export class ScheduleEventLineItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'schedule_event_id', type: 'uuid' })
  scheduleEventId!: string;

  @ManyToOne(() => ScheduleEvent, (event) => event.lineItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'schedule_event_id' })
  scheduleEvent!: ScheduleEvent;

  @Column({ name: 'decoration_id', type: 'uuid' })
  decorationId!: string;

  @ManyToOne(() => Decoration, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'decoration_id' })
  decoration!: Decoration;

  @Column({ type: 'int' })
  quantity!: number;
}
