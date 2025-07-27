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
  DataSource,
} from 'typeorm';
import { User } from './User.entity';
import { Event } from './Event.entity';
import { TeacherType } from './TeacherType.entity';
import { IsOptional, ValidateIf } from 'class-validator';
import { CrudValidationGroups } from '@dataui/crud';
import { IsNotEmpty, MaxLength, IsNumber } from '@shared/utils/validation/class-validator-he';
import { StringType, NumberType } from '@shared/utils/entity/class-transformer';
import { IHasUserId } from '@shared/base-entity/interface';
import { findOneAndAssignReferenceId, getDataSource } from '@shared/utils/entity/foreignKey.util';

@Entity('teachers')
@Index('teachers_user_id_idx', ['userId'], {})
@Index('teachers_name_idx', ['name'], {})
@Index('teachers_own_user_id_idx', ['ownUserId'], {})
@Index('teachers_teacher_type_id_idx', ['teacherTypeReferenceId'], {})
export class Teacher implements IHasUserId {
  @BeforeInsert()
  @BeforeUpdate()
  async fillFields() {
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

  @Column('int', { name: 'own_user_id', nullable: true })
  ownUserId: number;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(9, { always: true })
  @Column({ length: 9, nullable: true })
  tz: string;

  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255 })
  name: string;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(50, { always: true })
  @Column({ length: 50, nullable: true })
  phone: string;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255, nullable: true })
  email: string;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255, nullable: true })
  school: string;

  @ValidateIf((teacher: Teacher) => !Boolean(teacher.teacherTypeReferenceId), {
    always: true,
  })
  @IsOptional({ always: true })
  @NumberType
  @IsNumber({ maxDecimalPlaces: 0 }, { always: true })
  @Column({ nullable: true })
  teacherTypeKey: number;

  @ValidateIf((teacher: Teacher) => !Boolean(teacher.teacherTypeKey) && Boolean(teacher.teacherTypeReferenceId), {
    always: true,
  })
  @Column({ nullable: true })
  teacherTypeReferenceId: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  price: number;

  @IsOptional({ always: true })
  @StringType
  @MaxLength(255, { always: true })
  @Column({ length: 255, nullable: true, name: 'training_teacher' })
  trainingTeacher: string;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'special_question', nullable: true })
  specialQuestion: number;

  @IsOptional({ always: true })
  @NumberType
  @Column('int', { name: 'student_count', nullable: true })
  studentCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'own_user_id' })
  ownUser: User;

  @ManyToOne(() => TeacherType, { nullable: true })
  @JoinColumn({ name: 'teacherTypeReferenceId' })
  teacherType: TeacherType;

  // @OneToMany(() => Event, event => event.teacher)
  // events: Event[];
}
