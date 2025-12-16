import { DataSource, In } from 'typeorm';
import { AttReport } from '../db/entities/AttReport.entity';
import { getStudentCountForTeacherDate } from './studentGroup.util';

/**
 * Updates the student count for attendance reports based on the student groups table.
 * 
 * @param dataSource TypeORM DataSource
 * @param ids Array of AttReport IDs to update
 * @returns A string summarizing the update result
 */
export async function updateStudentCountForReports(dataSource: DataSource, ids: number[]): Promise<string> {
  const attReportRepo = dataSource.getRepository(AttReport);

  const reports = await attReportRepo.find({
    where: { id: In(ids) },
    select: ['id', 'userId', 'teacherReferenceId', 'reportDate', 'howManyStudents'],
  });

  let updatedCount = 0;

  for (const report of reports) {
    if (!report.teacherReferenceId || !report.reportDate) continue;

    const count = await getStudentCountForTeacherDate(
      dataSource,
      report.userId,
      report.teacherReferenceId,
      report.reportDate
    );

    if (count > 0) {
      report.howManyStudents = count;
      await attReportRepo.save(report);
      updatedCount++;
    }
  }

  return `עודכנו ${updatedCount} דיווחים`;
}
