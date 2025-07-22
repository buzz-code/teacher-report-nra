import { calculateAttendanceReportPrice } from '../pricing.util';
import { AttReport } from '../../db/entities/AttReport.entity';

describe('pricing.util', () => {
  describe('calculateAttendanceReportPrice', () => {
    const mockAttReport: Partial<AttReport> = {
      id: 1,
      userId: 1,
      teacherId: 1,
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
      const priceMap = [
        { key: 1, price: 10 },
        { key: 2, price: 20 },
      ];
      const teacherTypeId = 1;

      const result = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Base price (50) + students (5*5=25) + methodic (2*8=16) + lessons (3*10=30) +
      // yalkut (1*12=12) + discussing (1*15=15) + help taught (2*6=12) +
      // watched (1*8=8) + individual watch (1*10=10) + interfere (2*12=24) +
      // students taught (3*5=15) + students watched (2*5*0.5=5)
      // = 50 + 25 + 16 + 30 + 12 + 15 + 12 + 8 + 10 + 24 + 15 + 5 = 222
      expect(result).toBe(222);
    });

    it('should handle price map as Map object', () => {
      const priceMap = new Map([
        [101, 100], // base price for teacher type 1
        [102, 8], // student multiplier for teacher type 1
      ]);
      const teacherTypeId = 1;

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

      const priceMap = [];
      const teacherTypeId = 1;

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

      const priceMap = [];
      const teacherTypeId = 1;

      const result = calculateAttendanceReportPrice(reportWithAbsences as AttReport, teacherTypeId, priceMap);

      const basicResult = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Should subtract 2 * 10 * 0.5 = 10 for absences
      expect(result).toBe(basicResult - 10);
    });

    it('should handle null/undefined values gracefully', () => {
      const reportWithNulls: Partial<AttReport> = {
        id: 1,
        userId: 1,
        teacherId: 1,
        reportDate: new Date('2023-01-01'),
        year: 2023,
        howManyStudents: null,
        howManyMethodic: undefined,
        howManyLessons: null,
        wasPhoneDiscussing: false,
        wasKamal: false,
      };

      const priceMap = [];
      const teacherTypeId = 1;

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

      const priceMap = [];
      const teacherTypeId = 1;

      const result = calculateAttendanceReportPrice(reportWithManyAbsences as AttReport, teacherTypeId, priceMap);

      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should round to 2 decimal places', () => {
      const priceMap = [
        { key: 101, price: 33.333 }, // This should create decimal results
      ];
      const teacherTypeId = 1;

      const result = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Result should be rounded to 2 decimal places
      expect(Number.isInteger(result * 100)).toBe(true);
    });

    it('should handle different teacher types with custom pricing', () => {
      const priceMap = [
        { key: 101, price: 100 }, // Base price for teacher type 1
        { key: 102, price: 10 }, // Student multiplier for teacher type 1
        { key: 201, price: 200 }, // Base price for teacher type 2
        { key: 202, price: 20 }, // Student multiplier for teacher type 2
      ];

      const result1 = calculateAttendanceReportPrice(mockAttReport as AttReport, 1, priceMap);

      const result2 = calculateAttendanceReportPrice(mockAttReport as AttReport, 2, priceMap);

      // Teacher type 2 should have higher base price and multipliers
      expect(result2).toBeGreaterThan(result1);
    });

    it('should handle empty price map', () => {
      const priceMap = [];
      const teacherTypeId = 1;

      const result = calculateAttendanceReportPrice(mockAttReport as AttReport, teacherTypeId, priceMap);

      // Should use default configuration
      expect(result).toBeGreaterThan(0);
    });

    it('should calculate correctly with only watched students (half rate)', () => {
      const watchOnlyReport: Partial<AttReport> = {
        id: 1,
        userId: 1,
        teacherId: 1,
        reportDate: new Date('2023-01-01'),
        year: 2023,
        howManyStudentsWatched: 10,
        howManyStudents: 0,
        howManyStudentsTeached: 0,
      };

      const priceMap = [];
      const teacherTypeId = 1;

      const result = calculateAttendanceReportPrice(watchOnlyReport as AttReport, teacherTypeId, priceMap);

      // Base price (50) + watched students (10 * 5 * 0.5 = 25) = 75
      expect(result).toBe(75);
    });
  });
});
