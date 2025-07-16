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
import { QuestionType } from './QuestionType.entity';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType, BooleanType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';

@Entity('questions')
@Index('questions_user_id_idx', ['userId'], {})
@Index('questions_teacher_type_id_idx', ['teacherTypeId'], {})
@Index('questions_question_type_id_idx', ['questionTypeId'], {})
export class Question implements IHasUserId {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'teacher_type_id', nullable: true })
  teacherTypeId: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'question_type_id', nullable: true })
  questionTypeId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @StringType
  @Column({ type: 'text' })
  content: string;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255, name: 'allowed_digits', nullable: true })
  allowedDigits: string;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'is_standalone', default: false })
  isStandalone: boolean;

  @IsOptional({ always: true })
  @Column('date', { name: 'start_date', nullable: true })
  startDate: Date;

  @IsOptional({ always: true })
  @Column('date', { name: 'end_date', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => QuestionType, { nullable: true })
  @JoinColumn({ name: 'question_type_id' })
  questionType: QuestionType;
}
