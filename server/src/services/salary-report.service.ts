import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AttReport } from '../db/entities/AttReport.entity';
import { SalaryReport } from '../db/entities/SalaryReport.entity';
import { Teacher } from '../db/entities/Teacher.entity';
import { Price } from '../db/entities/Price.entity';
import { calculateOriginalAttendancePrice } from '../utils/originalPricing.util';

interface SalaryReportSummary {
  id: number;
  name?: string;
  date: Date;
  totalReports: number;
  totalAmount: number;
  reports: AttReportWithPrice[];
}

interface AttReportWithPrice {
  id: number;
  reportDate: Date;
  teacher?: any;
  calculatedPrice: number;
  howManyStudents?: number;
  howManyLessons?: number;
  isConfirmed: boolean;
  // Add other fields as needed for display
}

interface MonthlyTeacherSummary {
  teacherId: number;
  teacherName: string;
  teacherType: string;
  totalReports: number;
  totalAmount: number;
  confirmedReports: number;
  unconfirmedReports: number;
}

@Injectable()
export class SalaryReportService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /**
   * Create a new salary report grouping multiple attendance reports
   */
  async createSalaryReport(reportIds: number[], userId: number, name?: string): Promise<SalaryReport> {
    const salaryReportRepo = this.dataSource.getRepository(SalaryReport);
    const attReportRepo = this.dataSource.getRepository(AttReport);

    // Validate that all reports belong to the user and are not already in a salary report
    const reports = await attReportRepo.find({
      where: { id: reportIds as any, userId },
      relations: ['teacher'],
    });

    if (reports.length !== reportIds.length) {
      throw new Error('Some reports were not found or do not belong to this user');
    }

    const reportsInSalary = reports.filter((report) => report.salaryReport);
    if (reportsInSalary.length > 0) {
      throw new Error('Some reports are already included in a salary report');
    }

    // Create salary report
    const salaryReport = salaryReportRepo.create({
      userId,
      ids: reportIds.join(','),
      date: new Date(),
      name,
    });

    const savedSalaryReport = await salaryReportRepo.save(salaryReport);

    // Update attendance reports to link to this salary report
    await attReportRepo.update({ id: reportIds as any }, { salaryReport: savedSalaryReport.id });

    return savedSalaryReport;
  }

  /**
   * Get salary report summary with calculated prices
   */
  async getSalaryReportSummary(salaryReportId: number, userId: number): Promise<SalaryReportSummary> {
    const salaryReportRepo = this.dataSource.getRepository(SalaryReport);
    const attReportRepo = this.dataSource.getRepository(AttReport);
    const priceRepo = this.dataSource.getRepository(Price);

    const salaryReport = await salaryReportRepo.findOne({
      where: { id: salaryReportId, userId },
    });

    if (!salaryReport) {
      throw new Error('Salary report not found');
    }

    const reportIds = salaryReport.ids.split(',').map((id) => parseInt(id));

    const reports = await attReportRepo.find({
      where: { id: reportIds as any },
      relations: ['teacher', 'teacher.teacherType'],
      order: { reportDate: 'DESC' },
    });

    // Get pricing data
    const priceData = await priceRepo.find({ where: { userId } });

    // Calculate prices for each report
    const reportsWithPrices: AttReportWithPrice[] = reports.map((report) => {
      const teacherTypeId = report.teacher?.teacherType?.key;
      const calculatedPrice = teacherTypeId ? calculateOriginalAttendancePrice(report, teacherTypeId, priceData) : 0;

      return {
        id: report.id,
        reportDate: report.reportDate,
        teacher: report.teacher,
        calculatedPrice,
        howManyStudents: report.howManyStudents,
        howManyLessons: report.howManyLessons,
        isConfirmed: report.isConfirmed,
      };
    });

    const totalAmount = reportsWithPrices.reduce((sum, report) => sum + report.calculatedPrice, 0);

    return {
      id: salaryReport.id,
      name: salaryReport.name,
      date: salaryReport.date,
      totalReports: reports.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      reports: reportsWithPrices,
    };
  }

  /**
   * Get monthly summary by teacher type
   */
  async getMonthlyTeacherSummary(year: number, month: number, userId: number): Promise<MonthlyTeacherSummary[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attReportRepo = this.dataSource.getRepository(AttReport);
    const priceRepo = this.dataSource.getRepository(Price);

    const reports = await attReportRepo.find({
      where: {
        userId,
        reportDate: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      relations: ['teacher', 'teacher.teacherType'],
    });

    // Get pricing data
    const priceData = await priceRepo.find({ where: { userId } });

    // Group by teacher
    const teacherGroups = new Map<number, AttReport[]>();
    reports.forEach((report) => {
      const teacherId = report.teacher?.id;
      if (teacherId) {
        if (!teacherGroups.has(teacherId)) {
          teacherGroups.set(teacherId, []);
        }
        const teacherReports = teacherGroups.get(teacherId);
        if (teacherReports) {
          teacherReports.push(report);
        }
      }
    });

    // Calculate summary for each teacher
    const summaries: MonthlyTeacherSummary[] = [];

    for (const [teacherId, teacherReports] of teacherGroups) {
      const teacher = teacherReports[0].teacher;
      if (!teacher) continue;

      const confirmedReports = teacherReports.filter((r) => r.isConfirmed).length;
      const unconfirmedReports = teacherReports.length - confirmedReports;

      // Calculate total amount
      const totalAmount = teacherReports.reduce((sum, report) => {
        const teacherTypeId = teacher.teacherType?.key;
        const price = teacherTypeId ? calculateOriginalAttendancePrice(report, teacherTypeId, priceData) : 0;
        return sum + price;
      }, 0);

      summaries.push({
        teacherId,
        teacherName: teacher.name,
        teacherType: teacher.teacherType?.name || 'לא צוין',
        totalReports: teacherReports.length,
        totalAmount: Math.round(totalAmount * 100) / 100,
        confirmedReports,
        unconfirmedReports,
      });
    }

    return summaries.sort((a, b) => a.teacherName.localeCompare(b.teacherName, 'he'));
  }

  /**
   * Confirm multiple reports at once
   */
  async confirmReports(reportIds: number[], userId: number): Promise<void> {
    const attReportRepo = this.dataSource.getRepository(AttReport);

    // Validate reports belong to user and are not in salary reports
    const reports = await attReportRepo.find({
      where: { id: reportIds as any, userId },
    });

    const reportsInSalary = reports.filter((report) => report.salaryReport);
    if (reportsInSalary.length > 0) {
      throw new Error('Cannot confirm reports that are already in salary reports');
    }

    await attReportRepo.update({ id: reportIds as any, userId }, { isConfirmed: true });
  }

  /**
   * Update salary month for multiple reports
   */
  async updateSalaryMonth(reportIds: number[], salaryMonth: string, userId: number): Promise<void> {
    const attReportRepo = this.dataSource.getRepository(AttReport);

    await attReportRepo.update({ id: reportIds as any, userId }, { salaryMonth: parseInt(salaryMonth) });
  }

  /**
   * Get reports ready for salary processing (confirmed but not in salary report)
   */
  async getReportsReadyForSalary(userId: number): Promise<AttReport[]> {
    const attReportRepo = this.dataSource.getRepository(AttReport);

    return await attReportRepo.find({
      where: {
        userId,
        isConfirmed: true,
        salaryReport: null,
      },
      relations: ['teacher', 'teacher.teacherType'],
      order: { reportDate: 'DESC' },
    });
  }
}
