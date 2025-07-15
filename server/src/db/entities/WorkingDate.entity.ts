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
import { IsNotEmpty } from '@shared/utils/validation/class-validator-he';
import { NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';

@Entity('working_dates')
@Index('working_dates_user_id_idx', ['userId'], {})
@Index('working_dates_teacher_type_id_idx', ['teacherTypeId'], {})
@Index('working_dates_working_date_idx', ['workingDate'], {})
export class WorkingDate implements IHasUserId {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'teacher_type_id', nullable: true })
  teacherTypeId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column('date', { name: 'working_date' })
  workingDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}