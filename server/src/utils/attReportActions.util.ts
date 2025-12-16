import { DataSource, In, IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AttReport } from '../db/entities/AttReport.entity';
import { StudentGroup } from '../db/entities/StudentGroup.entity';

/**
 * Updates the student count for attendance reports based on the student groups table.
 * 
 * @param dataSource TypeORM DataSource
 * @param ids Array of AttReport IDs to update
 * @returns A string summarizing the update result
 */
export async function updateStudentCountForReports(dataSource: DataSource, ids: number[]): Promise<string> {
  const attReportRepo = dataSource.getRepository(AttReport);
  const studentGroupRepo = dataSource.getRepository(StudentGroup);

  const reports = await attReportRepo.find({
    where: { id: In(ids) },
    select: ['id', 'userId', 'teacherReferenceId', 'reportDate', 'howManyStudents'],
  });

  let updatedCount = 0;

  for (const report of reports) {
    if (!report.teacherReferenceId || !report.reportDate) continue;

    const result = await studentGroupRepo
      .createQueryBuilder('group')
      .select('SUM(group.studentCount)', 'total')
      .where('group.userId = :userId', { userId: report.userId })
      .andWhere('group.teacherReferenceId = :teacherId', { teacherId: report.teacherReferenceId })
      .andWhere('(group.startDate IS NULL OR group.startDate <= :reportDate)', { reportDate: report.reportDate })
      .andWhere('(group.endDate IS NULL OR group.endDate >= :reportDate)', { reportDate: report.reportDate })
      .getRawOne();

    const count = parseInt(result?.total) || 0;

    if (count > 0) {
      report.howManyStudents = count;
      await attReportRepo.save(report);
      updatedCount++;
    }
  }

  return `עודכנו ${updatedCount} דיווחים`;
}
