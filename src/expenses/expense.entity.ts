import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum ExpenseCategory {
  SALARY = 'salary',
  MAINTENANCE = 'maintenance',
  UTILITIES = 'utilities',
  TRANSPORT = 'transport',
  SUPPLIES = 'supplies',
  OTHER = 'other',
}

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stationId: string;

  @Column()
  recordedByUserId: string;

  @Column({ type: 'date' })
  expenseDate: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ExpenseCategory, default: ExpenseCategory.OTHER })
  category: ExpenseCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
