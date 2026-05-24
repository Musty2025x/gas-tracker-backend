import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('entries')
export class Entry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stationId: string;

  @Column()
  attendantUserId: string;

  @Column({ type: 'date' })
  entryDate: string;

  // Meter readings
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  openingMeter: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  closingMeter: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalSalesKg: number; // closingMeter - openingMeter

  // Financial
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  pricePerKg: number; // Price at time of entry

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  expectedRevenue: number; // totalSalesKg * pricePerKg

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cashReceived: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  posReceived: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalRemitted: number; // cashReceived + posReceived

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  variance: number; // expectedRevenue - totalRemitted (negative = shortage)

  @Column({ nullable: true })
  notes: string;

  // Sync support for offline entries
  @Column({ nullable: true })
  localId: string; // Client-generated ID for offline sync dedup

  @Column({ default: false })
  isSynced: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
