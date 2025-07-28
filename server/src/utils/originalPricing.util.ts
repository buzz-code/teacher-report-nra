import { AttReport } from '../db/entities/AttReport.entity';
import { Price } from '../db/entities/Price.entity';

/**
 * Original Wolf Teacher Reports pricing calculation
 * Based on the exact pricing structure from the original system
 */

export type PriceData = Price[] | Record<number, number>;

/**
 * Calculate attendance report price using the original system's exact logic
 * @param attReport - The attendance report
 * @param teacherTypeId - Teacher type (1-7)
 * @param priceData - Price configuration
 * @returns Calculated price
 */
export function calculateOriginalAttendancePrice(
  attReport: AttReport,
  teacherTypeId: number,
  priceData: PriceData,
): number {
  const priceMap = convertToMap(priceData);

  switch (teacherTypeId) {
    case 1:
      return calculateSeminarKitaPrice(attReport, priceMap);
    case 2:
      return calculateTrainingTeacherPrice(attReport, priceMap);
    case 3:
      return calculateManhaPrice(attReport, priceMap);
    case 4:
      return calculateResponsiblePrice(attReport, priceMap);
    case 5:
      return calculatePdsPrice(attReport, priceMap);
    case 6:
      return calculateKindergartenPrice(attReport, priceMap);
    case 7:
      return calculateSpecialEducationPrice(attReport, priceMap);
    default:
      return 0;
  }
}

/**
 * Type 1 - Seminar Kita
 * Price keys: 11-15
 */
function calculateSeminarKitaPrice(attReport: AttReport, priceMap: Map<number, number>): number {
  const {
    howManyWatchOrIndividual = 0,
    howManyTeachedOrInterfering = 0,
    howManyDiscussingLessons = 0,
    wasKamal,
    howManyLessonsAbsence = 0,
    teacher,
  } = attReport;

  const studentCount = teacher?.studentCount || 1;

  const baseCalculation =
    howManyWatchOrIndividual * getPrice(priceMap, 11) +
    howManyTeachedOrInterfering * getPrice(priceMap, 12) +
    howManyDiscussingLessons * getPrice(priceMap, 13) +
    (wasKamal ? 1 : 0) * getPrice(priceMap, 14) +
    howManyLessonsAbsence * getPrice(priceMap, 15);

  const regularPay = baseCalculation * (0.5 * studentCount);

  // Add extra answers pay (would be calculated from Answer entities)
  return Math.max(0, Math.round(regularPay * 100) / 100);
}

/**
 * Type 2 - Training Teacher (not in use)
 * Fixed pricing: Watch: 60 NIS, Teach: 50 NIS, Discuss: 80 NIS, Private: 20 NIS
 */
function calculateTrainingTeacherPrice(attReport: AttReport, priceMap: Map<number, number>): number {
  const {
    howManyWatchOrIndividual = 0,
    howManyTeachedOrInterfering = 0,
    howManyDiscussingLessons = 0,
    howManyStudentsTeached = 0, // Use this as individual lessons count
  } = attReport;

  return (
    howManyWatchOrIndividual * 60 +
    howManyTeachedOrInterfering * 50 +
    howManyDiscussingLessons * 80 +
    howManyStudentsTeached * 20
  );
}

/**
 * Type 3 - Manha
 * Price keys: 51-60
 */
function calculateManhaPrice(attReport: AttReport, priceMap: Map<number, number>): number {
  const {
    howManyWatchedLessons = 0,
    howManyStudentsTeached = 0,
    howManyYalkutLessons = 0,
    howManyDiscussingLessons = 0,
    howManyStudentsHelpTeached = 0,
    howManyMethodic = 0,
    isTaarifHulia,
    isTaarifHulia2,
    isTaarifHulia3,
  } = attReport;

  const regularPay =
    howManyWatchedLessons * getPrice(priceMap, 51) +
    howManyStudentsTeached * getPrice(priceMap, 52) +
    howManyYalkutLessons * getPrice(priceMap, 53) +
    howManyDiscussingLessons * getPrice(priceMap, 54) +
    howManyStudentsHelpTeached * getPrice(priceMap, 55) +
    howManyMethodic * getPrice(priceMap, 56) +
    (isTaarifHulia ? 1 : 0) * getPrice(priceMap, 57) +
    (isTaarifHulia2 ? 1 : 0) * getPrice(priceMap, 58) +
    (isTaarifHulia3 ? 1 : 0) * getPrice(priceMap, 59);

  // Add extra answers pay (would be calculated from Answer entities)
  return Math.max(0, Math.round(regularPay * 100) / 100);
}

/**
 * Type 4 - Responsible (not in use)
 */
function calculateResponsiblePrice(attReport: AttReport, priceMap: Map<number, number>): number {
  // Not implemented in original system
  return 0;
}

/**
 * Type 5 - PDS
 * Price keys: 40-42
 */
function calculatePdsPrice(attReport: AttReport, priceMap: Map<number, number>): number {
  const { howManyWatchOrIndividual = 0, howManyTeachedOrInterfering = 0, howManyDiscussingLessons = 0 } = attReport;

  const regularPay =
    howManyWatchOrIndividual * getPrice(priceMap, 40) +
    howManyTeachedOrInterfering * getPrice(priceMap, 42) +
    howManyDiscussingLessons * getPrice(priceMap, 41);

  // Add extra answers pay (would be calculated from Answer entities)
  return Math.max(0, Math.round(regularPay * 100) / 100);
}

/**
 * Type 6 - Kindergarten
 * Price keys: 24, 25, 60
 */
function calculateKindergartenPrice(attReport: AttReport, priceMap: Map<number, number>): number {
  const { howManyStudents = 0, wasDiscussing, wasCollectiveWatch } = attReport;

  const regularPay =
    (wasCollectiveWatch ? 1 : 0) * getPrice(priceMap, 60) +
    howManyStudents * getPrice(priceMap, 24) +
    (wasDiscussing ? 1 : 0) * getPrice(priceMap, 25);

  // Add extra answers pay (would be calculated from Answer entities)
  return Math.max(0, Math.round(regularPay * 100) / 100);
}

/**
 * Type 7 - Special Education
 * Price keys: 26-28
 */
function calculateSpecialEducationPrice(attReport: AttReport, priceMap: Map<number, number>): number {
  const { howManyLessons = 0, howManyStudentsWatched = 0, howManyStudentsTeached = 0, wasPhoneDiscussing } = attReport;

  const regularPay =
    howManyLessons * howManyStudentsWatched * getPrice(priceMap, 26) +
    howManyStudentsTeached * getPrice(priceMap, 27) +
    (wasPhoneDiscussing ? 1 : 0) * getPrice(priceMap, 28);

  // Add extra answers pay (would be calculated from Answer entities)
  return Math.max(0, Math.round(regularPay * 100) / 100);
}

/**
 * Get price from map with default fallback
 */
function getPrice(priceMap: Map<number, number>, key: number, defaultPrice = 0): number {
  return priceMap.get(key) ?? defaultPrice;
}

/**
 * Convert price data to Map for efficient lookup
 */
function convertToMap(priceData: PriceData): Map<number, number> {
  if (Array.isArray(priceData)) {
    return new Map(priceData.map((price) => [price.key, price.price]));
  }
  return new Map(Object.entries(priceData).map(([key, value]) => [parseInt(key), value]));
}

/**
 * Calculate extra pay from answers to special questions
 * This would need to be implemented based on the Answer entity relationships
 */
export async function calculateExtraPayFromAnswers(
  attReport: AttReport,
  answerRepository: any,
  priceMap: Map<number, number>,
): Promise<number> {
  // TODO: Implement based on Answer entity queries
  // This would query answers related to this report and calculate extra payments
  return 0;
}
