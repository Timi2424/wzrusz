import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Decoration } from './decoration.entity';
import { Inquiry } from './inquiry.entity';

@Entity('inquiry_line_items')
export class InquiryLineItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'inquiry_id', type: 'uuid' })
  inquiryId!: string;

  @ManyToOne(() => Inquiry, (inquiry) => inquiry.lineItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inquiry_id' })
  inquiry!: Inquiry;

  @Column({ name: 'decoration_id', type: 'uuid' })
  decorationId!: string;

  @ManyToOne(() => Decoration, (decoration) => decoration.inquiryLineItems, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'decoration_id' })
  decoration!: Decoration;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;
}
