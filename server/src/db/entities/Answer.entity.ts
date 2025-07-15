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
import { Teacher } from './Teacher.entity';
import { Question } from './Question.entity';
import { AttReport } from './AttReport.entity';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty } from '@shared/utils/validation/class-validator-he';
import { NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';

@Entity('answers')
@Index('answers_user_id_idx', ['userId'], {})
@Index('answers_teacher_id_idx', ['teacherId'], {})
@Index('answers_question_id_idx', ['questionId'], {})
@Index('answers_report_id_idx', ['reportId'], {})
@Index('answers_answer_date_idx', ['answerDate'], {})
export class Answer implements IHasUserId {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @Column('int', { name: 'teacher_id' })
  teacherId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @Column('int', { name: 'question_id' })
  questionId: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'report_id', nullable: true })
  reportId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @Column('int')
  answer: number;

  @IsOptional({ always: true })
  @Column('date', { name: 'answer_date', nullable: true })
  answerDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Question, { nullable: true })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => AttReport, { nullable: true })
  @JoinColumn({ name: 'report_id' })
  report: AttReport;
}
