import { ViewEntity, ViewColumn, PrimaryColumn, ManyToOne, JoinColumn, DataSource } from 'typeorm';
import { IHasUserId } from '@shared/base-entity/interface';
import { User } from '../entities/User.entity';
import { Teacher } from '../entities/Teacher.entity';
import { SalaryReport } from '../entities/SalaryReport.entity';
import { ReportableItem } from './ReportableItem.entity';

@ViewEntity('salary_report_by_teacher', {
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('CONCAT(ri.salaryReportId, "_", ri.teacherReferenceId)', 'id')
      .addSelect('ri.userId', 'userId')
      .addSelect('ri.salaryReportId', 'salaryReportId')
      .addSelect('ri.teacherReferenceId', 'teacherReferenceId')
      .from(ReportableItem, 'ri')
      .where('ri.salaryReportId IS NOT NULL')
      .andWhere('ri.teacherReferenceId IS NOT NULL')
      .groupBy('ri.userId')
      .addGroupBy('ri.salaryReportId')
      .addGroupBy('ri.teacherReferenceId'),
})
export class SalaryReportByTeacher implements IHasUserId {
  @ViewColumn()
  @PrimaryColumn()
  id: string; // '{salaryReportId}_{teacherReferenceId}'

  @ViewColumn()
  userId: number;

  @ViewColumn()
  salaryReportId: number;

  @ViewColumn()
  teacherReferenceId: number;

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
