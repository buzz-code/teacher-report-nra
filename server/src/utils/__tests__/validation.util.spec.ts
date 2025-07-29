import { Repository } from 'typeorm';
import { validateAbsencesPerMonth, validateWorkingDay, validateReportModification } from '../validation.util';
import { AttReport } from '../../db/entities/AttReport.entity';

// Mock repositories
const mockAttReportRepository = {
  createQueryBuilder: jest.fn(),
} as unknown as Repository<AttReport>;

const mockWorkingDateRepository = {
  findOne: jest.fn(),
} as unknown as Repository<any>;

describe('Validation Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // NOTE: validateNotFutureDate and validateSeminarKitaLessonCount tests have been moved
  // to class-validator decorators in AttReport.entity.ts. These tests should be updated
  // to test the entity validation directly.

  describe('validateAbsencesPerMonth', () => {
    it('should return null for report with no absences', async () => {
      const attReport = {
        id: 1,
        howManyLessonsAbsence: 0,
        teacherReferenceId: 1,
        reportDate: new Date('2023-01-15'),
      } as AttReport;

      const result = await validateAbsencesPerMonth(attReport, mockAttReportRepository, 1);
      expect(result).toBeNull();
    });

    it('should return null when total absences are within limit', async () => {
      const attReport = {
        id: 1,
        howManyLessonsAbsence: 3,
        teacherReferenceId: 1,
        reportDate: new Date('2023-01-15'),
      } as AttReport;

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ howManyLessonsAbsence: 2 }, { howManyLessonsAbsence: 3 }]),
      };

      (mockAttReportRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await validateAbsencesPerMonth(attReport, mockAttReportRepository, 1);
      expect(result).toBeNull();
    });

    it('should return error when total absences exceed 10', async () => {
      const attReport = {
        id: 1,
        howManyLessonsAbsence: 4,
        teacherReferenceId: 1,
        reportDate: new Date('2023-01-15'),
      } as AttReport;

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ howManyLessonsAbsence: 4 }, { howManyLessonsAbsence: 3 }]),
      };

      (mockAttReportRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await validateAbsencesPerMonth(attReport, mockAttReportRepository, 1);
      expect(result).toContain('לא ניתן לדווח על יותר מ-10 חיסורים בחודש');
      expect(result).toContain('כבר דווחו 7 חיסורים');
    });
  });

  describe('validateWorkingDay', () => {
    it('should return null when teacher type is not available', async () => {
      const attReport = {
        reportDate: new Date('2023-01-15'),
        teacher: {},
      } as AttReport;

      const result = await validateWorkingDay(attReport, mockWorkingDateRepository, 1);
      expect(result).toBeNull();
    });

    it('should return null when working date exists', async () => {
      const attReport = {
        reportDate: new Date('2023-01-15'),
        teacher: { teacherTypeReferenceId: 1 },
      } as AttReport;

      (mockWorkingDateRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await validateWorkingDay(attReport, mockWorkingDateRepository, 1);
      expect(result).toBeNull();
    });

    it('should return error when working date does not exist', async () => {
      const attReport = {
        reportDate: new Date('2023-01-15'),
        teacher: { teacherTypeReferenceId: 1 },
      } as AttReport;

      (mockWorkingDateRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await validateWorkingDay(attReport, mockWorkingDateRepository, 1);
      expect(result).toContain('אינו יום עבודה מוגדר');
    });
  });

  describe('validateReportModification', () => {
    it('should return null for unconfirmed report without salary link', () => {
      const attReport = {
        isConfirmed: false,
        salaryReport: null,
      } as AttReport;

      const result = validateReportModification(attReport);
      expect(result).toBeNull();
    });

    it('should return error for confirmed report', () => {
      const attReport = {
        isConfirmed: true,
        salaryReport: null,
      } as AttReport;

      const result = validateReportModification(attReport);
      expect(result).toContain('לא ניתן לעדכן דוח שכבר אושר');
    });

    it('should return error for report linked to salary', () => {
      const attReport = {
        isConfirmed: false,
        salaryReport: 123,
      } as AttReport;

      const result = validateReportModification(attReport);
      expect(result).toContain('לא ניתן לעדכן דוח הקשור לדוח שכר');
    });
  });
});
