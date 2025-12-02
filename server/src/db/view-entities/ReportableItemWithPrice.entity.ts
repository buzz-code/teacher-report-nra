import { ViewEntity, ViewColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IHasUserId } from '@shared/base-entity/interface';
import { User } from '../entities/User.entity';
import { Teacher } from '../entities/Teacher.entity';
import { SalaryReport } from '../entities/SalaryReport.entity';

/**
 * Generate SQL for the ReportableItemWithPrice view.
 *
 * This view is a UNION of:
 * - att_report_with_price (attendance reports with calculated prices)
 * - answer_with_price (answers with calculated prices)
 *
 * Provides a unified view of all reportable items with their prices,
 * useful for:
 * - Displaying all reportables in one list
 * - Aggregating by salary_report + teacher (salary_report_by_teacher)
 */
function generateReportableItemWithPriceSQL(): string {
  return `
    SELECT
      CONCAT('report_', id) AS id,
      'report' AS type,
      userId,
      teacherReferenceId,
      salaryReportId,
      reportDate,
      calculatedPrice,
      createdAt
    FROM att_report_with_price
    
    UNION ALL
    
    SELECT
      CONCAT('answer_', id) AS id,
      'answer' AS type,
      userId,
      teacherReferenceId,
      salaryReportId,
      reportDate,
      calculatedPrice,
      createdAt
    FROM answer_with_price
  `;
}

/**
 * ReportableItemWithPrice view entity - unified view of all reportable items with prices.
 *
 * Features:
 * - Combines att_reports and answers into a single view
 * - Each row has a calculated price
 * - Type field distinguishes between 'report' and 'answer'
 *
 * Used by salary_report_by_teacher for efficient aggregation.
 */
@ViewEntity({
  name: 'reportable_item_with_price',
  expression: generateReportableItemWithPriceSQL(),
})
export class ReportableItemWithPrice implements IHasUserId {
  @PrimaryColumn()
  id: string; // 'report_123' or 'answer_456'

  @ViewColumn()
  type: 'report' | 'answer';

  @ViewColumn()
  userId: number;

  @ViewColumn()
  teacherReferenceId: number;

  @ViewColumn()
  salaryReportId: number | null;

  @ViewColumn()
  reportDate: Date;

  @ViewColumn()
  calculatedPrice: number;

  @ViewColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Teacher, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'teacherReferenceId' })
  teacher: Teacher;

  @ManyToOne(() => SalaryReport, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'salaryReportId' })
  salaryReport: SalaryReport;
}
