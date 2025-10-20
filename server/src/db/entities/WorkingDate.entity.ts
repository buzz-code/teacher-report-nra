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
import { TeacherType } from './TeacherType.entity';
import { IsOptional, ValidateIf } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, IsNumber } from '@shared/utils/validation/class-validator-he';
import { NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';
import { fillDefaultYearValue } from '@shared/utils/entity/year.util';

@Entity('working_dates')
@Index('working_dates_user_id_idx', ['userId'], {})
@Index('working_dates_teacher_type_id_idx', ['teacherTypeReferenceId'], {})
@Index('working_dates_working_date_idx', ['workingDate'], {})
@Index('working_dates_year_idx', ['year'], {})
export class WorkingDate implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
    fillDefaultYearValue(this);

    let dataSource: DataSource;
    try {
      dataSource = await getDataSource([TeacherType]);

      this.teacherTypeReferenceId = await findOneAndAssignReferenceId(
        dataSource,
        TeacherType,
        { key: this.teacherTypeKey },
        this.userId,
        this.teacherTypeReferenceId,
        this.teacherTypeKey,
      );
    } finally {
      dataSource?.destroy();
    }
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ValidateIf((workingDate: WorkingDate) => !Boolean(workingDate.teacherTypeReferenceId), {
    always: true,
  })
  @IsOptional({ always: true })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  teacherTypeKey: number;

  @ValidateIf(
    (workingDate: WorkingDate) => !Boolean(workingDate.teacherTypeKey) && Boolean(workingDate.teacherTypeReferenceId),
    { always: true },
  )
  @Column({ nullable: true })
  teacherTypeReferenceId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column('date', { name: 'working_date' })
  workingDate: Date;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { nullable: true })
  year: number;

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
}
