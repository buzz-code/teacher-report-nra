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
      CONCAT(rip.salaryReportId, '_', rip.teacherReferenceId, '_', YEAR(rip.reportDate), '_', MONTH(rip.reportDate)) AS id,
      rip.userId,
      rip.salaryReportId,
      rip.teacherReferenceId,
      YEAR(rip.reportDate) AS reportYear,
      MONTH(rip.reportDate) AS reportMonth,
      
      -- Counts by type
      SUM(CASE WHEN rip.type = 'answer' THEN 1 ELSE 0 END) AS answerCount,
      SUM(CASE WHEN rip.type = 'report' THEN 1 ELSE 0 END) AS attReportCount,
      
      -- Totals by type
      SUM(CASE WHEN rip.type = 'answer' THEN rip.calculatedPrice ELSE 0 END) AS answersTotal,
      SUM(CASE WHEN rip.type = 'report' THEN rip.calculatedPrice ELSE 0 END) AS attReportsTotal,
      
      -- Grand total
      SUM(rip.calculatedPrice) AS grandTotal
      
    FROM reportable_item_with_price rip
    WHERE rip.salaryReportId IS NOT NULL
      AND rip.teacherReferenceId IS NOT NULL
      AND rip.reportDate IS NOT NULL
    GROUP BY rip.userId, rip.salaryReportId, rip.teacherReferenceId, YEAR(rip.reportDate), MONTH(rip.reportDate)
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
