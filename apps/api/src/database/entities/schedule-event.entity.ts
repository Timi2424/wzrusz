import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inquiry } from './inquiry.entity';
import { ScheduleEventLineItem } from './schedule-event-line-item.entity';

@Entity('schedule_events')
export class ScheduleEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt!: Date;

  @Column({ name: 'ends_at', type: 'timestamptz' })
  endsAt!: Date;

  @Column({ name: 'inquiry_id', type: 'uuid', nullable: true })
  inquiryId!: string | null;

  @ManyToOne(() => Inquiry, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'inquiry_id' })
  inquiry!: Inquiry | null;

  @OneToMany(() => ScheduleEventLineItem, (line) => line.scheduleEvent)
  lineItems!: ScheduleEventLineItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
