import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InquiryStatus } from './inquiry-status.enum';
import { InquiryLineItem } from './inquiry-line-item.entity';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 200 })
  fullName!: string;

  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  phone!: string | null;

  @Column({ name: 'event_start', type: 'timestamptz' })
  eventStart!: Date;

  @Column({ name: 'event_end', type: 'timestamptz' })
  eventEnd!: Date;

  @Column({ name: 'transport_address', type: 'text' })
  transportAddress!: string;

  @Column({ name: 'needs_invoice', type: 'boolean', default: false })
  needsInvoice!: boolean;

  @Column({ name: 'invoice_notes', type: 'text', nullable: true })
  invoiceNotes!: string | null;

  @Column({
    type: 'enum',
    enum: InquiryStatus,
    default: InquiryStatus.Submitted,
  })
  status!: InquiryStatus;

  @OneToMany(() => InquiryLineItem, (line) => line.inquiry)
  lineItems!: InquiryLineItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
