import { AttReport } from '../db/entities/AttReport.entity';
import { TeacherTypeId, isValidTeacherType } from './fieldsShow.util';

/**
 * Price map interface - either an array of prices with key-value pairs or a Map
 */
type PriceMap = { key: number; price: number }[] | Map<number, number>;

/**
 * Pricing configuration for different activity types
 */
interface PricingConfig {
  basePrice: number;
  studentMultiplier: number;
  lessonMultiplier: number;
  methodicMultiplier: number;
  yalkutLessonMultiplier: number;
  discussingLessonMultiplier: number;
  helpTeachedMultiplier: number;
  watchedLessonMultiplier: number;
  individualWatchMultiplier: number;
  interfereTeachMultiplier: number;
  phoneDiscussingBonus: number;
  kamalBonus: number;
  collectiveWatchBonus: number;
  taarifHuliaBonus: number;
  taarifHulia2Bonus: number;
  taarifHulia3Bonus: number;
}

/**
 * Calculate the total price for an attendance report based on teacher type and pricing configuration
 * @param attReport - The attendance report data
 * @param teacherTypeId - The teacher type ID from TeacherTypeId enum
 * @param priceMap - Either an array of price objects with key-value pairs or a Map of key to price
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

  // Convert priceMap to a consistent format for lookup
  const priceData = convertPriceMapToObject(priceMap);

  // Get base pricing configuration for this teacher type
  const config = getPricingConfigForTeacherType(teacherTypeId, priceData);

  // Calculate price based on various report metrics
  let totalPrice = config.basePrice;

  // Helper function to add numeric field pricing
  const addNumericPrice = (value: number | null | undefined, multiplier: number, factor = 1): void => {
    totalPrice += (value || 0) * multiplier * factor;
  };

  // Helper function to add boolean field pricing
  const addBooleanPrice = (condition: boolean | null | undefined, bonus: number): void => {
    if (condition) {
      totalPrice += bonus;
    }
  };

  // Add pricing based on student counts
  addNumericPrice(attReport.howManyStudents, config.studentMultiplier);
  addNumericPrice(attReport.howManyStudentsTeached, config.studentMultiplier);
  addNumericPrice(attReport.howManyStudentsWatched, config.studentMultiplier, 0.5); // Watch is less intensive
  addNumericPrice(attReport.howManyStudentsHelpTeached, config.helpTeachedMultiplier);

  // Add pricing based on lesson counts
  addNumericPrice(attReport.howManyLessons, config.lessonMultiplier);
  addNumericPrice(attReport.howManyYalkutLessons, config.yalkutLessonMultiplier);
  addNumericPrice(attReport.howManyDiscussingLessons, config.discussingLessonMultiplier);
  addNumericPrice(attReport.howManyWatchedLessons, config.watchedLessonMultiplier);
  addNumericPrice(attReport.howManyWatchOrIndividual, config.individualWatchMultiplier);
  addNumericPrice(attReport.howManyTeachedOrInterfering, config.interfereTeachMultiplier);

  // Add pricing based on methodical work
  addNumericPrice(attReport.howManyMethodic, config.methodicMultiplier);

  // Subtract for absences (negative impact on payment)
  addNumericPrice(attReport.howManyLessonsAbsence, config.lessonMultiplier, -0.5);

  // Add bonuses for special activities
  addBooleanPrice(attReport.wasPhoneDiscussing, config.phoneDiscussingBonus);
  addBooleanPrice(attReport.wasKamal, config.kamalBonus);
  addBooleanPrice(attReport.wasCollectiveWatch, config.collectiveWatchBonus);
  addBooleanPrice(attReport.isTaarifHulia, config.taarifHuliaBonus);
  addBooleanPrice(attReport.isTaarifHulia2, config.taarifHulia2Bonus);
  addBooleanPrice(attReport.isTaarifHulia3, config.taarifHulia3Bonus);

  // Ensure the price doesn't go below zero
  return Math.max(0, Math.round(totalPrice * 100) / 100); // Round to 2 decimal places
}

/**
 * Convert various price map formats to a consistent object format
 */
function convertPriceMapToObject(priceMap: PriceMap): Record<number, number> {
  if (Array.isArray(priceMap)) {
    return priceMap.reduce((obj, item) => {
      obj[item.key] = item.price;
      return obj;
    }, {} as Record<number, number>);
  } else if (priceMap instanceof Map) {
    return Object.fromEntries(priceMap.entries());
  }

  // If it's already an object format, return as-is
  return priceMap as Record<number, number>;
}

/**
 * Get pricing configuration based on teacher type ID and available price data
 */
function getPricingConfigForTeacherType(
  teacherTypeId: TeacherTypeId,
  priceData: Record<number, number>,
): PricingConfig {
  // Default configuration
  const defaultConfig: PricingConfig = {
    basePrice: 50,
    studentMultiplier: 5,
    lessonMultiplier: 10,
    methodicMultiplier: 8,
    yalkutLessonMultiplier: 12,
    discussingLessonMultiplier: 15,
    helpTeachedMultiplier: 6,
    watchedLessonMultiplier: 8,
    individualWatchMultiplier: 10,
    interfereTeachMultiplier: 12,
    phoneDiscussingBonus: 20,
    kamalBonus: 25,
    collectiveWatchBonus: 15,
    taarifHuliaBonus: 30,
    taarifHulia2Bonus: 35,
    taarifHulia3Bonus: 40,
  };

  // Override with specific pricing data if available
  // Price keys mapping (these would be configured based on actual pricing structure):
  // 1-20: base configurations
  // 21-40: multipliers
  // 41-60: bonuses

  const config = { ...defaultConfig };

  // Map price keys to configuration properties based on teacher type
  const baseKey = teacherTypeId * 100; // Each teacher type gets a range of 100 keys

  if (priceData[baseKey + 1]) config.basePrice = priceData[baseKey + 1];
  if (priceData[baseKey + 2]) config.studentMultiplier = priceData[baseKey + 2];
  if (priceData[baseKey + 3]) config.lessonMultiplier = priceData[baseKey + 3];
  if (priceData[baseKey + 4]) config.methodicMultiplier = priceData[baseKey + 4];
  if (priceData[baseKey + 5]) config.yalkutLessonMultiplier = priceData[baseKey + 5];
  if (priceData[baseKey + 6]) config.discussingLessonMultiplier = priceData[baseKey + 6];
  if (priceData[baseKey + 7]) config.helpTeachedMultiplier = priceData[baseKey + 7];
  if (priceData[baseKey + 8]) config.watchedLessonMultiplier = priceData[baseKey + 8];
  if (priceData[baseKey + 9]) config.individualWatchMultiplier = priceData[baseKey + 9];
  if (priceData[baseKey + 10]) config.interfereTeachMultiplier = priceData[baseKey + 10];
  if (priceData[baseKey + 11]) config.phoneDiscussingBonus = priceData[baseKey + 11];
  if (priceData[baseKey + 12]) config.kamalBonus = priceData[baseKey + 12];
  if (priceData[baseKey + 13]) config.collectiveWatchBonus = priceData[baseKey + 13];
  if (priceData[baseKey + 14]) config.taarifHuliaBonus = priceData[baseKey + 14];
  if (priceData[baseKey + 15]) config.taarifHulia2Bonus = priceData[baseKey + 15];
  if (priceData[baseKey + 16]) config.taarifHulia3Bonus = priceData[baseKey + 16];

  return config;
}
