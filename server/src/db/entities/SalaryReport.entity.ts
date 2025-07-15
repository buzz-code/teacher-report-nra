import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User.entity';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength } from '@shared/utils/validation/class-validator-he';
import { StringType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';

@Entity('salary_reports')
@Index('salary_reports_user_id_idx', ['userId'], {})
@Index('salary_reports_date_idx', ['date'], {})
export class SalaryReport implements IHasUserId {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @IsOptional({ always: true })
  @StringType
  @Column({ type: 'text', nullable: true })
  ids: string;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column('datetime')
  date: Date;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255, nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}