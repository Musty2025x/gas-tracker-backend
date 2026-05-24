import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'super_admin', // GasTracker platform admin
  OWNER = 'owner',             // Gas plant owner
  MANAGER = 'manager',         // Station manager
  ATTENDANT = 'attendant',     // Floor attendant
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ATTENDANT })
  role: UserRole;

  @Column({ nullable: true })
  stationId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  fcmToken: string; // Firebase push notification token

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
