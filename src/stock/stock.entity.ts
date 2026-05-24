import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum StockType {
  DELIVERY = 'delivery',   // Gas received from supplier
  ADJUSTMENT = 'adjustment', // Manual correction
  OPENING = 'opening',     // Opening stock for new period
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stationId: string;

  @Column()
  recordedByUserId: string;

  @Column({ type: 'enum', enum: StockType })
  type: StockType;

  @Column({ type: 'date' })
  movementDate: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  quantityKg: number;

  @Column({ nullable: true })
  supplierName: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costPerKg: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalCost: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  receiptUrl: string; // Cloudinary URL

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
