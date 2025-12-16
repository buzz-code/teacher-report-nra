import { DataSource } from 'typeorm';
import { StudentGroup } from '../db/entities/StudentGroup.entity';

/**
 * Calculates the total student count for a teacher on a specific date.
 * Sums up student counts from all active groups for that teacher on that date.
 * 
 * @param dataSource TypeORM DataSource
 * @param userId The user ID (organization)
 * @param teacherId The teacher's ID
 * @param date The date to check for active groups
 * @returns The total number of students
 */
export async function getStudentCountForTeacherDate(
  dataSource: DataSource,
  userId: number,
  teacherId: number,
  date: Date
): Promise<number> {
  const studentGroupRepository = dataSource.getRepository(StudentGroup);

  const result = await studentGroupRepository
    .createQueryBuilder('group')
    .select('SUM(group.studentCount)', 'total')
    .where('group.userId = :userId', { userId })
    .andWhere('group.teacherReferenceId = :teacherId', { teacherId })
    .andWhere('(group.startDate IS NULL OR group.startDate <= :date)', { date })
    .andWhere('(group.endDate IS NULL OR group.endDate >= :date)', { date })
    .getRawOne();

  return parseInt(result?.total) || 0;
}
