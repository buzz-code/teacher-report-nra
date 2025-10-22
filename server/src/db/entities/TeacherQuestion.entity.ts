import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IsInt, IsOptional } from 'class-validator';
import { User } from './User.entity';
import { Teacher } from './Teacher.entity';
import { Question } from './Question.entity';
import { Answer } from './Answer.entity';

@Entity('teacher_questions')
@Index(['userId'])
@Index(['teacherReferenceId'])
@Index(['questionReferenceId'])
@Index(['answerReferenceId'])
export class TeacherQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  @IsInt()
  userId: number;

  @Column('int')
  @IsInt()
  teacherReferenceId: number;

  @Column('int')
  @IsInt()
  questionReferenceId: number;

  @Column('int', { nullable: true })
  @IsOptional()
  @IsInt()
  answerReferenceId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations without foreign key constraints (soft references)
  @ManyToOne(() => User, { eager: false, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Teacher, { eager: false, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'teacher_reference_id' })
  teacher: Teacher;

  @ManyToOne(() => Question, { eager: false, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'question_reference_id' })
  question: Question;

  @ManyToOne(() => Answer, { eager: false, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'answer_reference_id' })
  answer: Answer;
}
