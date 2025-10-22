import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from './User.entity';
import { AttReport } from './AttReport.entity';
import { Answer } from './Answer.entity';
import { IsOptional } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { fillDefaultYearValue } from '@shared/utils/entity/year.util';

@Entity('salary_reports')
@Index('salary_reports_user_id_idx', ['userId'], {})
@Index('salary_reports_date_idx', ['date'], {})
@Index('salary_reports_year_idx', ['year'], {})
export class SalaryReport implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  autoAssignYear() {
    fillDefaultYearValue(this);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @Column('datetime')
  date: Date;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255, nullable: true })
  name: string;

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

  @OneToMany(() => AttReport, (attReport) => attReport.salaryReport)
  attReports: AttReport[];

  @OneToMany(() => Answer, (answer) => answer.salaryReport)
  answers: Answer[];
}
