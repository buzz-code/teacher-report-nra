import { AttReport } from '../db/entities/AttReport.entity';
import { Repository } from 'typeorm';

/**
 * Business validation rules for attendance reports
 *
 * NOTE: Simple validations have been moved to class-validator decorators in AttReport.entity.ts
 * The validations below require database access or complex business logic that cannot be handled by class-validator
 */

/**
 * Validates that a teacher doesn't exceed 10 absences per month
 * @param attReport - The attendance report being validated
 * @param attReportRepository - Repository for querying existing reports
 * @param userId - Current user ID
 * @returns Promise<string | null> - Error message if validation fails, null if valid
 *
 * TODO: This validation requires database queries to check existing reports
 * and cannot be implemented using class-validator decorators
 */
export async function validateAbsencesPerMonth(
  attReport: AttReport,
  attReportRepository: Repository<AttReport>,
  userId: number,
): Promise<string | null> {
  const { howManyLessonsAbsence, teacherReferenceId, reportDate } = attReport;

  // Skip validation if no absences reported
  if (!howManyLessonsAbsence || howManyLessonsAbsence === 0) {
    return null;
  }

  // Calculate month boundaries
  const reportMonth = new Date(reportDate);
  const monthStart = new Date(reportMonth.getFullYear(), reportMonth.getMonth(), 1);
  const monthEnd = new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1, 0, 23, 59, 59);

  // Get existing reports for this teacher in the same month
  const existingReports = await attReportRepository
    .createQueryBuilder('report')
    .where('report.userId = :userId', { userId })
    .andWhere('report.teacherReferenceId = :teacherReferenceId', { teacherReferenceId })
    .andWhere('report.reportDate >= :monthStart', { monthStart })
    .andWhere('report.reportDate <= :monthEnd', { monthEnd })
    .andWhere('report.id != :currentId', { currentId: attReport.id || 0 }) // Exclude current report if updating
    .getMany();

  // Calculate total absences for the month
  const existingAbsences = existingReports.reduce((total, report) => total + (report.howManyLessonsAbsence || 0), 0);

  const totalAbsences = existingAbsences + howManyLessonsAbsence;

  // Check the 10 absences limit
  if (totalAbsences > 10) {
    return `לא ניתן לדווח על יותר מ-10 חיסורים בחודש. כבר דווחו ${existingAbsences} חיסורים, ניסיון להוסיף ${howManyLessonsAbsence} נוספים.`;
  }

  return null;
}

/**
 * Validates that a report is not being created/modified for a non-working day
 * @param attReport - The attendance report being validated
 * @param workingDateRepository - Repository for querying working dates
 * @param userId - Current user ID
 * @returns Promise<string | null> - Error message if validation fails, null if valid
 *
 * TODO: This validation requires database queries to check working dates
 * and cannot be implemented using class-validator decorators
 */
export async function validateWorkingDay(
  attReport: AttReport,
  workingDateRepository: Repository<any>, // WorkingDate repository
  userId: number,
): Promise<string | null> {
  const { reportDate, teacher } = attReport;

  if (!teacher?.teacherTypeReferenceId) {
    return null; // Cannot validate without teacher type
  }

  // Check if the report date is a working day for this teacher type
  const workingDate = await workingDateRepository.findOne({
    where: {
      userId,
      teacherTypeReferenceId: teacher.teacherTypeReferenceId,
      workingDate: reportDate,
    },
  });

  if (!workingDate) {
    const hebrewDate = new Date(reportDate).toLocaleDateString('he-IL');
    return `תאריך ${hebrewDate} אינו יום עבודה מוגדר עבור סוג המורה. יש לבדוק בהגדרות ימי העבודה.`;
  }

  return null;
}

/**
 * Validates that a report cannot be modified if it's already confirmed or linked to salary report
 * @param attReport - The attendance report being validated
 * @returns string | null - Error message if validation fails, null if valid
 *
 * TODO: This validation involves business logic checking related entities
 * and cannot be fully implemented using class-validator decorators
 */
export function validateReportModification(attReport: AttReport): string | null {
  if (attReport.isConfirmed) {
    return 'לא ניתן לעדכן דוח שכבר אושר. יש לבטל את האישור תחילה.';
  }

  if (attReport.salaryReport) {
    return 'לא ניתן לעדכן דוח הקשור לדוח שכר. יש להסיר את הקישור תחילה.';
  }

  return null;
}
