import { calculateAttendanceReportPrice } from '../pricing.util';
import { AttReport } from '../../db/entities/AttReport.entity';
import { TeacherTypeId } from '../fieldsShow.util';

describe('pricing.util', () => {
  describe('calculateAttendanceReportPrice', () => {
    // Helper function to create a price map with semantic codes
    const createPriceMap = (overrides: Record<string, number> = {}): Map<string, number> => {
      const defaults = {
        'lesson.base': 50,
        'seminar.student_multiplier': 5,
        'seminar.lesson_multiplier': 10,
        'seminar.yalkut_lesson_multiplier': 12,
        'seminar.discussing_lesson_multiplier': 15,
        'seminar.help_taught_multiplier': 6,
        'seminar.watched_lesson_multiplier': 8,
        'seminar.watch_individual_multiplier': 10,
        'seminar.interfere_teach_multiplier': 12,
        'seminar.methodic_multiplier': 8,
        'seminar.phone_discussion_bonus': 20,
        'seminar.kamal_bonus': 25,
        'seminar.collective_watch_bonus': 15,
        'seminar.taarif_hulia_bonus': 30,
        'seminar.taarif_hulia2_bonus': 35,
        'seminar.taarif_hulia3_bonus': 40,
      };
      return new Map(Object.entries({ ...defaults, ...overrides }));
    };

    const mockAttReport: Partial<AttReport> = {
      id: 1,
      userId: 1,
      teacherTz: '123456789',
      reportDate: new Date('2023-01-01'),
      year: 2023,
      isConfirmed: false,
      howManyStudents: 5,
      howManyMethodic: 2,
      howManyLessons: 3,
      howManyYalkutLessons: 1,
      howManyDiscussingLessons: 1,
      howManyStudentsHelpTeached: 2,
      howManyLessonsAbsence: 0,
      howManyWatchedLessons: 1,
      howManyWatchOrIndividual: 1,
      howManyTeachedOrInterfering: 2,
      howManyStudentsTeached: 3,
      howManyStudentsWatched: 2,
      wasPhoneDiscussing: false,
      wasKamal: false,
      wasCollectiveWatch: false,
      isTaarifHulia: false,
      isTaarifHulia2: false,
      isTaarifHulia3: false,
    };

    it('should calculate basic price with default configuration', () => {
      const priceMap = createPriceMap();
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Base price (50) + students (5*5=25) + methodic (2*8=16) + lessons (3*10=30) +
      // yalkut (1*12=12) + discussing (1*15=15) + help taught (2*6=12) +
      // watched (1*8=8) + individual watch (1*10=10) + interfere (2*12=24) +
      // students taught (3*5=15) + students watched (2*5*0.5=5)
      // = 50 + 25 + 16 + 30 + 12 + 15 + 12 + 8 + 10 + 24 + 15 + 5 = 222
      expect(result).toBe(222);
    });

    it('should handle price map as Map object', () => {
      const priceMap = createPriceMap({
        'lesson.base': 100,
        'seminar.student_multiplier': 8,
      });
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Should use base price of 100 and student multiplier of 8 from the map
      // Base price (100) + students (5*8=40) + methodic (2*8=16) + lessons (3*10=30) + etc.
      expect(result).toBeGreaterThan(100);
    });

    it('should add bonuses for special activities', () => {
      const specialReport: Partial<AttReport> = {
        ...mockAttReport,
        wasPhoneDiscussing: true,
        wasKamal: true,
        wasCollectiveWatch: true,
        isTaarifHulia: true,
        isTaarifHulia2: true,
        isTaarifHulia3: true,
      };

      const priceMap = createPriceMap();
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(specialReport as AttReport, teacherTypeId, priceMap);

      const basicResult = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Should include all bonuses: 20 + 25 + 15 + 30 + 35 + 40 = 165
      expect(result).toBe(basicResult + 165);
    });

    it('should subtract for absences', () => {
      const reportWithAbsences: Partial<AttReport> = {
        ...mockAttReport,
        howManyLessonsAbsence: 2,
      };

      const priceMap = createPriceMap();
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(reportWithAbsences as AttReport, teacherTypeId, priceMap);

      const basicResult = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Should subtract 2 * 10 * 0.5 = 10 for absences
      expect(result).toBe(basicResult - 10);
    });

    it('should handle null/undefined values gracefully', () => {
      const reportWithNulls: Partial<AttReport> = {
        id: 1,
        userId: 1,
        teacherTz: '123456789',
        reportDate: new Date('2023-01-01'),
        year: 2023,
        howManyStudents: null,
        howManyMethodic: undefined,
        howManyLessons: null,
        wasPhoneDiscussing: false,
        wasKamal: false,
      };

      const priceMap = createPriceMap();
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(reportWithNulls as AttReport, teacherTypeId, priceMap);

      // Should only calculate base price since all other values are null/undefined
      expect(result).toBe(50);
    });

    it('should never return negative price', () => {
      const reportWithManyAbsences: Partial<AttReport> = {
        ...mockAttReport,
        howManyLessonsAbsence: 100, // Very high absence count
        howManyStudents: 0,
        howManyMethodic: 0,
        howManyLessons: 0,
      };

      const priceMap = createPriceMap();
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(reportWithManyAbsences as AttReport, teacherTypeId, priceMap);

      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should round to 2 decimal places', () => {
      const priceMap = createPriceMap({
        'lesson.base': 33.333,
      });
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Result should be rounded to 2 decimal places
      expect(Number.isInteger(result * 100)).toBe(true);
    });

    it('should handle different teacher types with custom pricing', () => {
      const priceMap1 = createPriceMap({
        'lesson.base': 100,
        'seminar.student_multiplier': 10,
      });

      const priceMap2 = createPriceMap({
        'lesson.base': 200,
        'manha.student_multiplier': 20,
      });

      const result1 = calculateAttendanceReportPrice(mockAttReport as AttReport, 1, priceMap1);

      const result2 = calculateAttendanceReportPrice(mockAttReport as AttReport, 3, priceMap2);

      // Teacher type 3 (manha) should have higher base price
      expect(result2).toBeGreaterThan(result1);
    });

    it('should handle empty price map', () => {
      const priceMap = new Map<string, number>();
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Should use default of 0 for all values, returning 0
      expect(result).toBe(0);
    });

    it('should calculate correctly with only watched students (half rate)', () => {
      const watchOnlyReport: Partial<AttReport> = {
        id: 1,
        userId: 1,
        teacherTz: '123456789',
        reportDate: new Date('2023-01-01'),
        year: 2023,
        howManyStudentsWatched: 10,
        howManyStudents: 0,
        howManyStudentsTeached: 0,
      };

      const priceMap = createPriceMap();
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const result = calculateAttendanceReportPrice(watchOnlyReport as AttReport, teacherTypeId, priceMap);

      // Base price (50) + watched students (10 * 5 * 0.5 = 25) = 75
      expect(result).toBe(75);
    });

    it('should throw error for invalid teacher type', () => {
      const priceMap = createPriceMap();
      const invalidTeacherTypeId = 99 as TeacherTypeId; // Cast to avoid TypeScript error

      expect(() => {
        calculateAttendanceReportPrice(mockAttReport as AttReport, invalidTeacherTypeId, priceMap);
      }).toThrow('Invalid teacher type ID: 99');
    });
  });
});
