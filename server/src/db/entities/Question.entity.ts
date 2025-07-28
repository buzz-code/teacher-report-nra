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
import { QuestionType } from './QuestionType.entity';
import { TeacherType } from './TeacherType.entity';
import { IsOptional, ValidateIf } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength, IsNumber } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType, BooleanType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';

@Entity('questions')
@Index('questions_user_id_idx', ['userId'], {})
@Index('questions_teacher_type_id_idx', ['teacherTypeReferenceId'], {})
@Index('questions_question_type_id_idx', ['questionTypeReferenceId'], {})
export class Question implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
    let dataSource: DataSource;
    try {
      dataSource = await getDataSource([TeacherType, QuestionType]);

      this.teacherTypeReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        TeacherType,
        { key: this.teacherTypeKey },
        this.userId,
        this.teacherTypeReferenceId,
        this.teacherTypeKey,
      );

      this.questionTypeReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        QuestionType,
        { key: this.questionTypeKey },
        this.userId,
        this.questionTypeReferenceId,
        this.questionTypeKey,
      );
    } finally {
      dataSource?.destroy();
    }
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ValidateIf((question: Question) => !Boolean(question.teacherTypeReferenceId), {
    always: true,
  })
  @IsOptional({ always: true })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  teacherTypeKey: number;

  @ValidateIf((question: Question) => !Boolean(question.teacherTypeKey) && Boolean(question.teacherTypeReferenceId), {
    always: true,
  })
  @Column({ nullable: true })
  teacherTypeReferenceId: number;

  @ValidateIf((question: Question) => !Boolean(question.questionTypeReferenceId), {
    always: true,
  })
  @IsOptional({ always: true })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  questionTypeKey: number;

  @ValidateIf((question: Question) => !Boolean(question.questionTypeKey) && Boolean(question.questionTypeReferenceId), {
    always: true,
  })
  @Column({ nullable: true })
  questionTypeReferenceId: number;

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

  @ManyToOne(() => TeacherType, { nullable: true })
  @JoinColumn({ name: 'teacherTypeReferenceId' })
  teacherType: TeacherType;

  @ManyToOne(() => QuestionType, { nullable: true })
  @JoinColumn({ name: 'questionTypeReferenceId' })
  questionType: QuestionType;
}
