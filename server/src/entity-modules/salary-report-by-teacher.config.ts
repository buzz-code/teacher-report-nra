import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { SalaryReportByTeacher } from '../db/view-entities/SalaryReportByTeacher.entity';
import { Answer } from '../db/entities/Answer.entity';
import { AttReport } from '../db/entities/AttReport.entity';
import { PriceByUser } from '../db/view-entities/PriceByUser.entity';
import { calculateAttendanceReportPrice } from '../utils/pricing.util';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: SalaryReportByTeacher,
    // Note: No eager joins - view entities don't work well with CRUD library joins
    // The frontend uses ReferenceField components for related data
    service: SalaryReportByTeacherService,
  };
}

interface SalaryReportByTeacherWithTotals extends SalaryReportByTeacher {
  answerCount?: number;
  attReportCount?: number;
  answersTotal?: number;
  attReportsTotal?: number;
  grandTotal?: number;
}

class SalaryReportByTeacherService<T extends Entity | SalaryReportByTeacher> extends BaseEntityService<T> {
  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any[], auth: any): Promise<void> {
    const data = list as SalaryReportByTeacherWithTotals[];

    switch (pivotName) {
      case 'WithTotals': {
        await this.handleWithTotalsPivot(data, auth);
        break;
      }
    }
  }

  private async handleWithTotalsPivot(data: SalaryReportByTeacherWithTotals[], auth: any): Promise<void> {
    const userId = getUserIdFromUser(auth);

    // Load pricing data once for all rows
    const priceMap = await this.loadPriceMap(userId);

    // Calculate totals for each row
    for (const row of data) {
      await this.calculateRowTotals(row, userId, priceMap);
    }
  }

  private async loadPriceMap(userId: number): Promise<Map<string, number>> {
    const priceByUserRepo = this.dataSource.getRepository(PriceByUser);
    const prices = await priceByUserRepo.find({ where: { userId } });
    return new Map(prices.map((p) => [p.code, p.price]));
  }

  private async calculateRowTotals(
    row: SalaryReportByTeacherWithTotals,
    userId: number,
    priceMap: Map<string, number>,
  ): Promise<void> {
    const answerRepo = this.dataSource.getRepository(Answer);
    const attReportRepo = this.dataSource.getRepository(AttReport);

    try {
      // Load answers for this salary_report + teacher
      const answers = await answerRepo.find({
        where: {
          salaryReportId: row.salaryReportId,
          teacherReferenceId: row.teacherReferenceId,
          userId,
        },
        relations: ['question'],
      });

      // Load att_reports for this salary_report + teacher
      const attReports = await attReportRepo.find({
        where: {
          salaryReportId: row.salaryReportId,
          teacherReferenceId: row.teacherReferenceId,
          userId,
        },
        relations: ['teacher', 'teacher.teacherType'],
      });

      // Calculate counts
      row.answerCount = answers.length;
      row.attReportCount = attReports.length;

      // Calculate answers total (answer × tariff)
      row.answersTotal = roundToTwoDecimals(
        answers.reduce((sum, answer) => {
          const tariff = answer.question?.tariff || 0;
          return sum + answer.answer * tariff;
        }, 0),
      );

      // Calculate att_reports total using pricing utility
      row.attReportsTotal = roundToTwoDecimals(
        attReports.reduce((sum, attReport) => {
          const teacherTypeId = attReport.teacher?.teacherType?.key;

          if (!teacherTypeId) {
            console.warn(`AttReport ${attReport.id} has no teacher type, skipping pricing`);
            return sum;
          }

          try {
            const price = calculateAttendanceReportPrice(attReport, teacherTypeId, priceMap);
            return sum + price;
          } catch (error) {
            console.error(`Failed to calculate price for att_report ${attReport.id}:`, error);
            return sum;
          }
        }, 0),
      );

      // Calculate grand total
      row.grandTotal = roundToTwoDecimals((row.answersTotal || 0) + (row.attReportsTotal || 0));
    } catch (error) {
      console.error(`Failed to calculate totals for row ${row.id}:`, error);
      row.answerCount = 0;
      row.attReportCount = 0;
      row.answersTotal = 0;
      row.attReportsTotal = 0;
      row.grandTotal = 0;
    }
  }
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export default getConfig();
