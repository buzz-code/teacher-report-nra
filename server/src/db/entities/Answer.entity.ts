import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  DataSource,
} from 'typeorm';
import { User } from './User.entity';
import { Teacher } from './Teacher.entity';
import { Question } from './Question.entity';
import { AttReport } from './AttReport.entity';
import { IsOptional, ValidateIf } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, IsNumber } from '@shared/utils/validation/class-validator-he';
import { NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';

@Entity('answers')
@Index('answers_user_id_idx', ['userId'], {})
@Index('answers_teacher_id_idx', ['teacherReferenceId'], {})
@Index('answers_question_id_idx', ['questionReferenceId'], {})
@Index('answers_report_id_idx', ['reportId'], {})
@Index('answers_answer_date_idx', ['answerDate'], {})
export class Answer implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
    let dataSource: DataSource;
    try {
      dataSource = await getDataSource([Teacher, Question]);

      this.teacherReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        Teacher,
        { tz: this.teacherTz },
        this.userId,
        this.teacherReferenceId,
        this.teacherTz,
      );

      this.questionReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        Question,
        { id: this.questionId },
        this.userId,
        this.questionReferenceId,
        this.questionId,
      );
    } finally {
      dataSource?.destroy();
    }
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ValidateIf((answer: Answer) => !Boolean(answer.teacherReferenceId), {
    always: true,
  })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  teacherTz: string;

  @ValidateIf((answer: Answer) => !Boolean(answer.teacherTz) && Boolean(answer.teacherReferenceId), { always: true })
  @Column({ nullable: true })
  teacherReferenceId: number;

  @ValidateIf((answer: Answer) => !Boolean(answer.questionReferenceId), {
    always: true,
  })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  questionId: number;

  @ValidateIf((answer: Answer) => !Boolean(answer.questionId) && Boolean(answer.questionReferenceId), { always: true })
  @Column({ nullable: true })
  questionReferenceId: number;

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
  @JoinColumn({ name: 'teacherReferenceId' })
  teacher: Teacher;

  @ManyToOne(() => Question, { nullable: true })
  @JoinColumn({ name: 'questionReferenceId' })
  question: Question;

  @ManyToOne(() => AttReport, { nullable: true })
  @JoinColumn({ name: 'report_id' })
  report: AttReport;
}
