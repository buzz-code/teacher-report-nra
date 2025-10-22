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
import { IsOptional, ValidateIf } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength, IsNumber, IsInt } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType, BooleanType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';

@Entity('questions')
@Index('questions_user_id_idx', ['userId'], {})
@Index('questions_question_type_id_idx', ['questionTypeReferenceId'], {})
export class Question implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
    let dataSource: DataSource;
    try {
      dataSource = await getDataSource([QuestionType, User]);

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
  @NumberType
  @IsInt({ always: true })
  @Column('int', { name: 'upper_limit', nullable: true })
  upperLimit: number;

  @IsOptional({ always: true })
  @NumberType
  @IsInt({ always: true })
  @Column('int', { name: 'lower_limit', nullable: true })
  lowerLimit: number;

  @IsOptional({ always: true })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 2 }, { always: true })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  tariff: number;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'is_mandatory', default: false })
  isMandatory: boolean;

  @IsOptional({ always: true })
  @Column('date', { name: 'start_date', nullable: true })
  startDate: Date;

  @IsOptional({ always: true })
  @Column('date', { name: 'end_date', nullable: true })
  endDate: Date;

  @IsOptional({ always: true })
  @Column('date', { name: 'effective_date', nullable: true })
  effectiveDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => QuestionType, { nullable: true })
  @JoinColumn({ name: 'questionTypeReferenceId' })
  questionType: QuestionType;
}
