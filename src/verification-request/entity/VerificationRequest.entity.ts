import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VerificationType } from '../Enum/verification-type.enum';

@Entity()
export class VerificationRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  userId!: string;

  @Column({ type: 'varchar', length: 255 })
  currentemail!: string;

  @Column({ type: 'enum', enum: VerificationType })
  type!: VerificationType;

  @Column({ type: 'varchar', length: 255 })
  targetValue!: string;

  @Column({ type: 'varchar', length: 255 })
  token!: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'int', default: 0 })
  attempts: number = 0;

  @Column({ type: 'timestamp', nullable: true })
  usedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
