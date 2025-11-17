import { AttReport } from '../db/entities/AttReport.entity';
import { TeacherTypeId, isValidTeacherType } from './fieldsShow.util';

/**
 * Calculate rate multiplier based on student count for StudentGroup pricing
 * @param studentCount - Number of students in the group
 * @returns Rate multiplier: 0.5 for 1 student, 1.0 for 2 students, 1.5 for 3+ students
 */
export function getStudentGroupRateMultiplier(studentCount: number): number {
  if (studentCount === 1) return 0.5; // Half rate (חצי תעריף)
  if (studentCount === 2) return 1.0; // Regular rate (תעריף רגיל)
  if (studentCount >= 3) return 1.5; // 1.5x rate (תעריף 1.5)
  return 1.0; // Default to regular rate
}

/**
 * Price map interface - Map of semantic code to price value
 * Example codes: 'lesson.base', 'seminar.student_multiplier', 'manha.methodic_multiplier'
 */
type PriceMap = Map<string, number>;

/**
 * Get teacher type prefix for semantic price codes
 * @param teacherTypeId - Teacher type ID
 * @returns Prefix string for the teacher type (e.g., 'seminar.', 'manha.', etc.)
 */
function getTeacherTypePrefix(teacherTypeId: TeacherTypeId): string {
  switch (teacherTypeId) {
    case 1: // SEMINAR_KITA
      return 'seminar.';
    case 3: // MANHA
      return 'manha.';
    case 5: // PDS
      return 'pds.';
    case 6: // KINDERGARTEN
      return 'kindergarten.';
    case 7: // SPECIAL_EDUCATION
      return 'special.';
    default:
      return '';
  }
}

/**
 * Helper function to get price by semantic code
 * @param priceMap - Map of semantic codes to prices
 * @param code - Semantic price code (e.g., 'lesson.base', 'seminar.student_multiplier')
 * @returns The price value or 0 if not found
 */
function getPrice(priceMap: Map<string, number>, code: string): number {
  return priceMap.get(code) ?? 0;
}

/**
 * Calculate the total price for an attendance report based on teacher type and semantic pricing
 * @param attReport - The attendance report data
 * @param teacherTypeId - The teacher type ID from TeacherTypeId enum
 * @param priceMap - Map of semantic price codes to values (e.g., 'lesson.base', 'seminar.student_multiplier')
 * @returns The calculated price as a number
 */
export function calculateAttendanceReportPrice(
  attReport: AttReport,
  teacherTypeId: TeacherTypeId,
  priceMap: PriceMap,
): number {
  // Validate teacher type using shared validation function
  if (!isValidTeacherType(teacherTypeId)) {
    throw new Error(`Invalid teacher type ID: ${teacherTypeId}`);
  }

  // Get teacher type prefix for semantic codes
  const prefix = getTeacherTypePrefix(teacherTypeId);

  // Start with base price (universal for all teacher types)
  let totalPrice = getPrice(priceMap, 'lesson.base');

  // Helper function to add numeric field pricing using semantic codes
  const addNumericPrice = (
    value: number | null | undefined,
    codeSuffix: string,
    factor = 1,
  ): void => {
    const code = prefix + codeSuffix;
    const multiplier = getPrice(priceMap, code);
    totalPrice += (value || 0) * multiplier * factor;
  };

  // Helper function to add boolean field pricing using semantic codes
  const addBooleanPrice = (
    condition: boolean | null | undefined,
    codeSuffix: string,
  ): void => {
    if (condition) {
      const code = prefix + codeSuffix;
      const bonus = getPrice(priceMap, code);
      totalPrice += bonus;
    }
  };

  // Add pricing based on student counts
  addNumericPrice(attReport.howManyStudents, 'student_multiplier');
  addNumericPrice(attReport.howManyStudentsTeached, 'student_multiplier');
  addNumericPrice(attReport.howManyStudentsWatched, 'student_multiplier', 0.5); // Watch is less intensive
  addNumericPrice(attReport.howManyStudentsHelpTeached, 'help_taught_multiplier');

  // Add pricing based on lesson counts
  addNumericPrice(attReport.howManyLessons, 'lesson_multiplier');
  addNumericPrice(attReport.howManyYalkutLessons, 'yalkut_lesson_multiplier');
  addNumericPrice(attReport.howManyDiscussingLessons, 'discussing_lesson_multiplier');
  addNumericPrice(attReport.howManyWatchedLessons, 'watched_lesson_multiplier');
  addNumericPrice(attReport.howManyWatchOrIndividual, 'watch_individual_multiplier');
  addNumericPrice(attReport.howManyTeachedOrInterfering, 'interfere_teach_multiplier');

  // Add pricing based on methodical work
  addNumericPrice(attReport.howManyMethodic, 'methodic_multiplier');

  // Subtract for absences (negative impact on payment)
  addNumericPrice(attReport.howManyLessonsAbsence, 'lesson_multiplier', -0.5);

  // Add bonuses for special activities
  addBooleanPrice(attReport.wasPhoneDiscussing, 'phone_discussion_bonus');
  addBooleanPrice(attReport.wasKamal, 'kamal_bonus');
  addBooleanPrice(attReport.wasCollectiveWatch, 'collective_watch_bonus');
  addBooleanPrice(attReport.isTaarifHulia, 'taarif_hulia_bonus');
  addBooleanPrice(attReport.isTaarifHulia2, 'taarif_hulia2_bonus');
  addBooleanPrice(attReport.isTaarifHulia3, 'taarif_hulia3_bonus');

  // Ensure the price doesn't go below zero
  return Math.max(0, Math.round(totalPrice * 100) / 100); // Round to 2 decimal places
}
