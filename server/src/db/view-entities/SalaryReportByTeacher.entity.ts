import { ViewEntity, ViewColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IHasUserId } from '@shared/base-entity/interface';
import { User } from '../entities/User.entity';
import { Teacher } from '../entities/Teacher.entity';
import { SalaryReport } from '../entities/SalaryReport.entity';

/**
 * Generate SQL for the SalaryReportByTeacher view.
 *
 * This view aggregates reportable_item_with_price by salary report and teacher:
 * - answerCount: Number of answers for this salary report + teacher
 * - attReportCount: Number of attendance reports for this salary report + teacher
 * - answersTotal: Sum of calculatedPrice for answers
 * - attReportsTotal: Sum of calculatedPrice for att_reports
 * - grandTotal: Sum of all calculatedPrice
 *
 * Uses the reportable_item_with_price view which already has calculated prices,
 * making this a simple GROUP BY aggregation.
 */
function generateSalaryReportByTeacherSQL(): string {
  return `
    SELECT
      CONCAT(t.salaryReportId, '_', t.teacherReferenceId, '_', t.reportYear, '_', t.reportMonth) AS id,
      t.userId,
      t.salaryReportId,
      t.teacherReferenceId,
      t.reportYear,
      t.reportMonth,
      
      -- Counts by type
      SUM(CASE WHEN t.type = 'answer' THEN 1 ELSE 0 END) AS answerCount,
      SUM(CASE WHEN t.type = 'report' THEN 1 ELSE 0 END) AS attReportCount,
      
      -- Totals by type
      SUM(CASE WHEN t.type = 'answer' THEN t.calculatedPrice ELSE 0 END) AS answersTotal,
      SUM(CASE WHEN t.type = 'report' THEN t.calculatedPrice ELSE 0 END) AS attReportsTotal,
      
      -- Grand total
      SUM(t.calculatedPrice) AS grandTotal
      
    FROM (
      SELECT
        userId,
        salaryReportId,
        teacherReferenceId,
        YEAR(reportDate) AS reportYear,
        MONTH(reportDate) AS reportMonth,
        type,
        calculatedPrice
      FROM reportable_item_with_price
      WHERE salaryReportId IS NOT NULL
        AND teacherReferenceId IS NOT NULL
        AND reportDate IS NOT NULL
    ) t
    GROUP BY t.userId, t.salaryReportId, t.teacherReferenceId, t.reportYear, t.reportMonth
  `;
}

/**
 * SalaryReportByTeacher view entity - aggregates reportable items by salary report and teacher.
 *
 * Features:
 * - Counts answers and att_reports per teacher/salary_report
 * - Sums calculated prices by type (answers vs reports)
 * - Computes grand total
 *
 * Built on top of reportable_item_with_price view for clean, efficient SQL.
 */
@ViewEntity({
  name: 'salary_report_by_teacher',
  expression: generateSalaryReportByTeacherSQL(),
})
export class SalaryReportByTeacher implements IHasUserId {
  @PrimaryColumn()
  id: string; // '{salaryReportId}_{teacherReferenceId}_{year}_{month}'

  @ViewColumn()
  userId: number;

  @ViewColumn()
  salaryReportId: number;

  @ViewColumn()
  teacherReferenceId: number;

  @ViewColumn()
  reportYear: number;

  @ViewColumn()
  reportMonth: number;

  // Aggregated counts
  @ViewColumn()
  answerCount: number;

  @ViewColumn()
  attReportCount: number;

  // Aggregated totals
  @ViewColumn()
  answersTotal: number;

  @ViewColumn()
  attReportsTotal: number;

  @ViewColumn()
  grandTotal: number;

  // Relations
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => SalaryReport, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'salaryReportId' })
  salaryReport: SalaryReport;

  @ManyToOne(() => Teacher, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'teacherReferenceId' })
  teacher: Teacher;
}
