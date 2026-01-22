import { DataSource } from 'typeorm';
import { AttReport } from '../db/entities/AttReport.entity';
import { PriceByUser } from '../db/view-entities/PriceByUser.entity';
import { AttReportWithPrice } from '../db/view-entities/AttReportWithPrice.entity';
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
export type PriceMap = Map<string, number>;

/**
 * Load prices for a user and return as a Map for efficient lookup
 * @param userId - The user ID to load prices for
 * @param dataSource - TypeORM DataSource
 * @returns Map of semantic price codes to values
 */
export async function getPriceMapForUser(userId: number, dataSource: DataSource): Promise<PriceMap> {
  const priceByUserRepo = dataSource.getRepository(PriceByUser);
  const prices = await priceByUserRepo.find({ where: { userId } });

  const priceMap = new Map<string, number>();
  prices.forEach((price) => priceMap.set(price.code, price.price));

  return priceMap;
}

/**
 * Calculate price for a single report with error handling
 * Returns 0 if calculation fails or teacher type is missing
 * @param report - The attendance report
 * @param teacherTypeKey - The teacher type key (can be null/undefined)
 * @param priceMap - Map of semantic price codes to values
 * @param includeExplanation - Whether to include price explanation (default: false)
 * @returns The calculated price (0 on error)
 */
export function calculateReportPriceSafe(
  report: AttReport,
  teacherTypeKey: number | null | undefined,
  priceMap: PriceMap,
  includeExplanation = false,
): { price: number; explanation?: PriceExplanation } {
  if (!teacherTypeKey) {
    return { price: 0 };
  }

  try {
    const result = calculateAttendanceReportPriceWithExplanation(report, teacherTypeKey, priceMap);
    return includeExplanation ? { price: result.price, explanation: result.explanation } : { price: result.price };
  } catch {
    return { price: 0 };
  }
}

/**
 * Interface for a single pricing component in the explanation
 */
export interface PriceComponent {
  fieldKey: string; // Field name for translation lookup (e.g., 'howManyStudents')
  value?: number; // Numeric value (for numeric fields)
  multiplier: number; // Price per unit
  factor?: number; // Additional factor (e.g., 0.5 for watched students, -0.5 for absences)
  subtotal: number; // Calculated amount
  isBonus?: boolean; // True for boolean bonus fields
}

/**
 * Interface for the complete pricing explanation
 */
export interface PriceExplanation {
  basePrice: number;
  components: PriceComponent[];
  totalPrice: number;
}

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
  // Delegate to the explanation version and return only the price
  const result = calculateAttendanceReportPriceWithExplanation(attReport, teacherTypeId, priceMap);
  return result.price;
}

/**
 * Calculate attendance report price with detailed explanation
 * @param attReport - The attendance report data
 * @param teacherTypeId - The teacher type ID from TeacherTypeId enum
 * @param priceMap - Map of semantic price codes to values
 * @returns Object containing price and structured explanation
 */
export function calculateAttendanceReportPriceWithExplanation(
  attReport: AttReport,
  teacherTypeId: TeacherTypeId,
  priceMap: PriceMap,
): { price: number; explanation: PriceExplanation } {
  // Validate teacher type using shared validation function
  if (!isValidTeacherType(teacherTypeId)) {
    throw new Error(`Invalid teacher type ID: ${teacherTypeId}`);
  }

  // Get teacher type prefix for semantic codes
  const prefix = getTeacherTypePrefix(teacherTypeId);

  // Start with base price (universal for all teacher types)
  const basePrice = getPrice(priceMap, 'lesson.base');
  let totalPrice = basePrice;

  const components: PriceComponent[] = [];

  // Helper function to add numeric field pricing with explanation
  const addNumericPrice = (
    value: number | null | undefined,
    fieldKey: string,
    codeSuffix: string,
    factor = 1,
  ): void => {
    if (value && value !== 0) {
      const code = prefix + codeSuffix;
      const multiplier = getPrice(priceMap, code);
      const subtotal = value * multiplier * factor;
      totalPrice += subtotal;

      components.push({
        fieldKey,
        value,
        multiplier,
        factor: factor !== 1 ? factor : undefined,
        subtotal: Math.round(subtotal * 100) / 100,
      });
    }
  };

  // Helper function to add boolean field pricing with explanation
  const addBooleanPrice = (
    condition: boolean | null | undefined,
    fieldKey: string,
    codeSuffix: string,
    factor = 1,
  ): void => {
    if (condition) {
      const code = prefix + codeSuffix;
      const bonus = getPrice(priceMap, code);
      const subtotal = bonus * factor;
      totalPrice += subtotal;

      components.push({
        fieldKey,
        multiplier: bonus,
        factor: factor !== 1 ? factor : undefined,
        subtotal: Math.round(subtotal * 100) / 100,
        isBonus: true,
      });
    }
  };

  // Calculate multiplier for seminar teachers (per student)
  const seminarMultiplier = teacherTypeId === TeacherTypeId.SEMINAR_KITA ? attReport.howManyStudents || 0 : 1;

  // Add pricing based on student counts
  addNumericPrice(attReport.howManyStudents, 'howManyStudents', 'student_multiplier');
  addNumericPrice(attReport.howManyStudentsTeached, 'howManyStudentsTeached', 'student_multiplier');
  addNumericPrice(attReport.howManyStudentsWatched, 'howManyStudentsWatched', 'student_multiplier');
  addNumericPrice(attReport.howManyStudentsHelpTeached, 'howManyStudentsHelpTeached', 'help_taught_multiplier');

  // Add pricing based on lesson counts
  addNumericPrice(attReport.howManyLessons, 'howManyLessons', 'lesson_multiplier');
  addNumericPrice(attReport.howManyYalkutLessons, 'howManyYalkutLessons', 'yalkut_lesson_multiplier');
  addNumericPrice(
    attReport.howManyDiscussingLessons,
    'howManyDiscussingLessons',
    'discussing_lesson_multiplier',
    seminarMultiplier,
  );
  addNumericPrice(attReport.howManyWatchedLessons, 'howManyWatchedLessons', 'watched_lesson_multiplier');
  addNumericPrice(
    attReport.howManyWatchOrIndividual,
    'howManyWatchOrIndividual',
    'watch_individual_multiplier',
    seminarMultiplier,
  );
  addNumericPrice(
    attReport.howManyTeachedOrInterfering,
    'howManyTeachedOrInterfering',
    'interfere_teach_multiplier',
    seminarMultiplier,
  );

  // Add pricing based on methodical work
  addNumericPrice(attReport.howManyMethodic, 'howManyMethodic', 'methodic_multiplier');

  // Add for absences (positive impact on payment as per request)
  addNumericPrice(attReport.howManyLessonsAbsence, 'howManyLessonsAbsence', 'absence_multiplier');

  // Add bonuses for special activities
  addBooleanPrice(attReport.wasPhoneDiscussing, 'wasPhoneDiscussing', 'phone_discussion_bonus');
  addBooleanPrice(attReport.wasKamal, 'wasKamal', 'kamal_bonus', seminarMultiplier);
  addBooleanPrice(attReport.wasCollectiveWatch, 'wasCollectiveWatch', 'collective_watch_bonus');
  addBooleanPrice(attReport.isTaarifHulia, 'isTaarifHulia', 'taarif_hulia_bonus');
  addBooleanPrice(attReport.isTaarifHulia2, 'isTaarifHulia2', 'taarif_hulia2_bonus');
  addBooleanPrice(attReport.isTaarifHulia3, 'isTaarifHulia3', 'taarif_hulia3_bonus');

  // Ensure the price is rounded correctly
  const finalPrice = Math.round(totalPrice * 100) / 100;

  return {
    price: finalPrice,
    explanation: {
      basePrice: Math.round(basePrice * 100) / 100,
      components,
      totalPrice: finalPrice,
    },
  };
}

/**
 * Get report prices using the SQL view (efficient for bulk operations).
 * Returns a map of report ID to calculated price.
 *
 * Use this for:
 * - Salary report generation
 * - Bulk price calculations
 * - Report listing with prices
 *
 * @param reportIds - Array of report IDs to get prices for
 * @param dataSource - TypeORM DataSource
 * @returns Map of report ID to price
 */
export async function getReportPricesFromView(
  reportIds: number[],
  dataSource: DataSource,
): Promise<Map<number, number>> {
  if (reportIds.length === 0) {
    return new Map();
  }

  const reportPriceRepo = dataSource.getRepository(AttReportWithPrice);
  const results = await reportPriceRepo.createQueryBuilder('rp').whereInIds(reportIds).getMany();

  return new Map(results.map((r) => [r.id, r.calculatedPrice]));
}

/**
 * Get all report prices for a salary report (batch operation).
 * @param salaryReportId - The salary report ID
 * @param dataSource - TypeORM DataSource
 * @returns Map of report ID to calculated price
 */
export async function getReportPricesForSalaryReport(
  salaryReportId: number,
  dataSource: DataSource,
): Promise<Map<number, number>> {
  const reportPriceRepo = dataSource.getRepository(AttReportWithPrice);
  const results = await reportPriceRepo.find({
    where: { salaryReportId },
  });

  return new Map(results.map((r) => [r.id, r.calculatedPrice]));
}

/**
 * Get report prices by user and optional filters.
 * Useful for generating reports with prices.
 *
 * @param userId - The user ID
 * @param dataSource - TypeORM DataSource
 * @param options - Optional filters (year, teacherReferenceId, etc.)
 * @returns Array of AttReportWithPrice entities
 */
export async function getReportPricesByUser(
  userId: number,
  dataSource: DataSource,
  options?: {
    year?: number;
    teacherReferenceId?: number;
    salaryReportId?: number | null;
  },
): Promise<AttReportWithPrice[]> {
  const reportPriceRepo = dataSource.getRepository(AttReportWithPrice);
  const queryBuilder = reportPriceRepo.createQueryBuilder('rp').where('rp.userId = :userId', { userId });

  if (options?.year !== undefined) {
    queryBuilder.andWhere('rp.year = :year', { year: options.year });
  }

  if (options?.teacherReferenceId !== undefined) {
    queryBuilder.andWhere('rp.teacherReferenceId = :teacherReferenceId', {
      teacherReferenceId: options.teacherReferenceId,
    });
  }

  if (options?.salaryReportId === null) {
    queryBuilder.andWhere('rp.salaryReportId IS NULL');
  } else if (options?.salaryReportId !== undefined) {
    queryBuilder.andWhere('rp.salaryReportId = :salaryReportId', {
      salaryReportId: options.salaryReportId,
    });
  }

  return queryBuilder.getMany();
}
