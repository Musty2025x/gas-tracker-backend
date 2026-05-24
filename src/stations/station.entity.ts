import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  ownerUserId: string; // References User with role=OWNER

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ default: true })
  isActive: boolean;

  // Current gas price per kg
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pricePerKg: number;

  @Column({ nullable: true })
  logoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
