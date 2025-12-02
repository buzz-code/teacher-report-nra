import { ViewEntity, ViewColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IHasUserId } from '@shared/base-entity/interface';
import { User } from '../entities/User.entity';
import { Teacher } from '../entities/Teacher.entity';
import { SalaryReport } from '../entities/SalaryReport.entity';

@ViewEntity('reportable_items', {
  expression: `
    SELECT 
      CONCAT('report_', id) as id,
      'report' as type,
      user_id as userId,
      teacherReferenceId,
      report_date as reportDate,
      salary_report_id as salaryReportId,
      createdAt
    FROM att_reports
    
    UNION ALL
    
    SELECT 
      CONCAT('answer_', id) as id,
      'answer' as type,
      user_id as userId,
      teacherReferenceId,
      report_date as reportDate,
      salary_report_id as salaryReportId,
      createdAt
    FROM answers
  `,
})
export class ReportableItem implements IHasUserId {
  @PrimaryColumn()
  id: string; // 'report_123' or 'answer_456'

  @ViewColumn()
  type: 'report' | 'answer';

  @ViewColumn()
  userId: number;

  @ViewColumn()
  teacherReferenceId: number;

  @ViewColumn()
  reportDate: Date;

  @ViewColumn()
  salaryReportId: number;

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
