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
import { AttType } from './AttType.entity';
import { IsOptional, ValidateIf } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import {
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType, BooleanType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';

@Entity('att_reports')
@Index('att_reports_user_id_idx', ['userId'], {})
@Index('att_reports_teacher_id_idx', ['teacherReferenceId'], {})
@Index('att_reports_report_date_idx', ['reportDate'], {})
@Index('att_reports_year_idx', ['year'], {})
@Index('att_reports_activity_type_idx', ['activityTypeReferenceId'], {})
export class AttReport implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
    let dataSource: DataSource;
    try {
      dataSource = await getDataSource([Teacher, AttType]);

      this.teacherReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        Teacher,
        { tz: this.teacherTz },
        this.userId,
        this.teacherReferenceId,
        this.teacherTz,
      );

      this.activityTypeReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        AttType,
        { key: this.activityTypeKey },
        this.userId,
        this.activityTypeReferenceId,
        this.activityTypeKey,
      );
    } finally {
      dataSource?.destroy();
    }
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ValidateIf((attReport: AttReport) => !Boolean(attReport.teacherReferenceId), {
    always: true,
  })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  teacherTz: string;

  @ValidateIf((attReport: AttReport) => !Boolean(attReport.teacherTz) && Boolean(attReport.teacherReferenceId), {
    always: true,
  })
  @Column({ nullable: true })
  teacherReferenceId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column('date', { name: 'report_date' })
  reportDate: Date;

  @IsOptional({ always: true })
  @Column('datetime', { name: 'update_date', nullable: true })
  updateDate: Date;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { nullable: true })
  year: number;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'is_confirmed', default: false })
  isConfirmed: boolean;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'salary_report', nullable: true })
  salaryReport: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'salary_month', nullable: true })
  salaryMonth: number;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(1000, { always: true })
  @Column({ type: 'text', nullable: true })
  comment: string;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_students', nullable: true })
  howManyStudents: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_methodic', nullable: true })
  howManyMethodic: number;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(4, { always: true })
  @Column({ length: 4, name: 'four_last_digits_of_teacher_phone', nullable: true })
  fourLastDigitsOfTeacherPhone: string;

  @IsOptional({ always: true })
  @StringType
  @Column({ type: 'text', name: 'teached_student_tz', nullable: true })
  teachedStudentTz: string;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_yalkut_lessons', nullable: true })
  howManyYalkutLessons: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_discussing_lessons', nullable: true })
  howManyDiscussingLessons: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_students_help_teached', nullable: true })
  howManyStudentsHelpTeached: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_lessons_absence', nullable: true })
  howManyLessonsAbsence: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_watched_lessons', nullable: true })
  howManyWatchedLessons: number;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'was_discussing', default: false })
  wasDiscussing: boolean;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'was_kamal', default: false })
  wasKamal: boolean;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'was_students_good', default: false })
  wasStudentsGood: boolean;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'was_students_enter_on_time', default: false })
  wasStudentsEnterOnTime: boolean;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'was_students_exit_on_time', default: false })
  wasStudentsExitOnTime: boolean;

  @ValidateIf((attReport: AttReport) => !Boolean(attReport.activityTypeReferenceId), {
    always: true,
  })
  @IsOptional({ always: true })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  activityTypeKey: number;

  @ValidateIf(
    (attReport: AttReport) => !Boolean(attReport.activityTypeKey) && Boolean(attReport.activityTypeReferenceId),
    { always: true },
  )
  @Column({ nullable: true })
  activityTypeReferenceId: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'teacher_to_report_for', nullable: true })
  teacherToReportFor: number;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'was_collective_watch', default: false })
  wasCollectiveWatch: boolean;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'is_taarif_hulia', default: false })
  isTaarifHulia: boolean;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'is_taarif_hulia2', default: false })
  isTaarifHulia2: boolean;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'is_taarif_hulia3', default: false })
  isTaarifHulia3: boolean;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_lessons', nullable: true })
  howManyLessons: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_watch_or_individual', nullable: true })
  howManyWatchOrIndividual: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_teached_or_interfering', nullable: true })
  howManyTeachedOrInterfering: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_students_teached', nullable: true })
  howManyStudentsTeached: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'how_many_students_watched', nullable: true })
  howManyStudentsWatched: number;

  @IsOptional({ always: true })
  @BooleanType
  @Column('boolean', { name: 'was_phone_discussing', default: false })
  wasPhoneDiscussing: boolean;

  @IsOptional({ always: true })
  @StringType
  @Column({ type: 'text', name: 'what_is_your_speciality', nullable: true })
  whatIsYourSpeciality: string;

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

  @ManyToOne(() => AttType, { nullable: true })
  @JoinColumn({ name: 'activityTypeReferenceId' })
  attType: AttType;
}
