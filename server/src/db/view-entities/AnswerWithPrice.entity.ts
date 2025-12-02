import { ViewEntity, ViewColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IHasUserId } from '@shared/base-entity/interface';
import { Teacher } from '../entities/Teacher.entity';
import { Question } from '../entities/Question.entity';
import { SalaryReport } from '../entities/SalaryReport.entity';

/**
 * Generate SQL for the AnswerWithPrice view.
 *
 * This view adds calculated price to each answer:
 * - calculatedPrice = answer × question.tariff
 *
 * Simple and efficient - just one join to questions table.
 */
function generateAnswerWithPriceSQL(): string {
  return `
    SELECT
      a.id,
      a.user_id AS userId,
      a.teacherReferenceId,
      a.teacherTz,
      a.questionReferenceId,
      a.questionId,
      a.salary_report_id AS salaryReportId,
      a.answer,
      a.report_date AS reportDate,
      a.createdAt,
      a.updatedAt,
      
      -- Question fields for price explanation on frontend
      q.content AS questionContent,
      q.tariff AS questionTariff,
      q.questionTypeReferenceId,
      q.questionTypeKey,
      
      -- Calculated price: answer × tariff
      COALESCE(a.answer * q.tariff, 0) AS calculatedPrice
      
    FROM answers a
    LEFT JOIN questions q ON q.id = a.questionReferenceId AND q.user_id = a.user_id
  `;
}

/**
 * AnswerWithPrice view entity - adds calculated price to answers.
 *
 * Features:
 * - Calculates price as answer × question.tariff
 * - Includes question fields for frontend price explanation
 * - Simple join, efficient query
 *
 * This mirrors the att_report_with_price pattern for consistency.
 */
@ViewEntity({
  name: 'answer_with_price',
  expression: generateAnswerWithPriceSQL(),
})
export class AnswerWithPrice implements IHasUserId {
  @PrimaryColumn()
  id: number;

  @ViewColumn()
  userId: number;

  @ViewColumn()
  teacherReferenceId: number;

  @ViewColumn()
  teacherTz: string;

  @ViewColumn()
  questionReferenceId: number;

  @ViewColumn()
  questionId: number;

  @ViewColumn()
  salaryReportId: number | null;

  @ViewColumn()
  answer: number;

  @ViewColumn()
  reportDate: Date;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  updatedAt: Date;

  // Question fields for price explanation
  @ViewColumn()
  questionContent: string;

  @ViewColumn()
  questionTariff: number;

  @ViewColumn()
  questionTypeReferenceId: number;

  @ViewColumn()
  questionTypeKey: number;

  // Calculated price
  @ViewColumn()
  calculatedPrice: number;

  // Relations
  @ManyToOne(() => Teacher, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'teacherReferenceId' })
  teacher: Teacher;

  @ManyToOne(() => Question, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'questionReferenceId' })
  question: Question;

  @ManyToOne(() => SalaryReport, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'salaryReportId' })
  salaryReport: SalaryReport;
}
