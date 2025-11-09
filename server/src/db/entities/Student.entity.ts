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
  Unique,
} from 'typeorm';
import { IsOptional, ValidateIf } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, IsUniqueCombination, MaxLength } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { Teacher } from './Teacher.entity';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';

@Entity('students')
@Index('students_user_id_idx', ['userId'], {})
@Index('students_name_idx', ['name'], {})
@Index('students_tz_idx', ['tz'], {})
@Index('students_teacher_id_idx', ['teacherReferenceId'], {})
@Index('students_start_date_idx', ['startDate'], {})
@Index('students_end_date_idx', ['endDate'], {})
@Unique(['userId', 'tz'])
export class Student implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
    let dataSource: DataSource;
    try {
      dataSource = await getDataSource([Teacher]);

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

  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @StringType
  @MaxLength(255, { always: true })
  @IsUniqueCombination(['userId'], [Student, Teacher], { always: true })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Column()
  tz: string;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @StringType
  @MaxLength(510, { always: true })
  @Column({ length: 510 })
  name: string;

  @ValidateIf((student: Student) => !Boolean(student.teacherReferenceId), {
    always: true,
  })
  @IsOptional({ always: true })
  @StringType
  @MaxLength(9, { always: true })
  @Column({ length: 9, nullable: true })
  teacherTz: string;

  @ValidateIf((student: Student) => !Boolean(student.teacherTz) && Boolean(student.teacherReferenceId), {
    always: true,
  })
  @Column({ nullable: true })
  teacherReferenceId: number;

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

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'teacherReferenceId' })
  teacher: Teacher;
}
