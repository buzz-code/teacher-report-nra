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
import { IsOptional, ValidateIf, IsInt, Min } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { Teacher } from './Teacher.entity';
import { User } from './User.entity';
import { TeacherType } from './TeacherType.entity';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';
import { fillDefaultYearValue } from '@shared/utils/entity/year.util';

@Entity('student_groups')
@Index('student_groups_user_id_idx', ['userId'], {})
@Index('student_groups_teacher_id_idx', ['teacherReferenceId'], {})
@Index('student_groups_start_date_idx', ['startDate'], {})
@Index('student_groups_end_date_idx', ['endDate'], {})
export class StudentGroup implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
    fillDefaultYearValue(this);

    let dataSource: DataSource;
    try {
      dataSource = await getDataSource([Teacher, User, TeacherType]);

      this.teacherReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        Teacher,
        { tz: this.teacherTz },
        this.userId,
        this.teacherReferenceId,
        this.teacherTz,
      );
    } finally {
      dataSource?.destroy();
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ValidateIf((group: StudentGroup) => !Boolean(group.teacherReferenceId), {
    always: true,
  })
  @IsOptional({ always: true })
  @StringType
  @MaxLength(9, { always: true })
  @Column({ length: 9, nullable: true })
  teacherTz: string;

  @ValidateIf((group: StudentGroup) => !Boolean(group.teacherTz) && Boolean(group.teacherReferenceId), {
    always: true,
  })
  @Column({ nullable: true })
  teacherReferenceId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column('date', { name: 'start_date' })
  startDate: Date;

  @IsOptional({ always: true })
  @Column('date', { name: 'end_date', nullable: true })
  endDate: Date;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { nullable: true })
  year: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @NumberType
  @IsInt({ always: true })
  @Min(1, { always: true })
  @Column('int', { name: 'student_count' })
  studentCount: number;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255, nullable: true, name: 'training_teacher' })
  trainingTeacher: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'teacherReferenceId' })
  teacher: Teacher;
}
