import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { SalaryReport } from '../db/entities/SalaryReport.entity';
import { Answer } from '../db/entities/Answer.entity';
import { AttReport } from '../db/entities/AttReport.entity';
import { PriceByUser } from '../db/view-entities/PriceByUser.entity';
import { calculateAttendanceReportPrice } from '../utils/pricing.util';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: SalaryReport,
    service: SalaryReportService,
  };
}

interface SalaryReportWithTotals extends SalaryReport {
  answersTotal?: number;
  attReportsTotal?: number;
  grandTotal?: number;
  answerCount?: number;
  attReportCount?: number;
}

class SalaryReportService<T extends Entity | SalaryReport> extends BaseEntityService<T> {
  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any[], auth: any): Promise<void> {
    const data = list as SalaryReport[];

    switch (pivotName) {
      case 'SalaryReportWithTotals': {
        await this.handleTotalsPivot(data, auth);
        break;
      }
    }
  }

  private async handleTotalsPivot(data: SalaryReport[], auth: any): Promise<void> {
    const userId = getUserIdFromUser(auth);

    // Get pricing data from PriceByUser view (includes system defaults + user overrides)
    const priceByUserRepo = this.dataSource.getRepository(PriceByUser);
    const prices = await priceByUserRepo.find({
      where: { userId },
    });

    // Build a Map of semantic code to price value for efficient lookup
    const priceMap = new Map<string, number>();
    prices.forEach((price) => {
      priceMap.set(price.code, price.price);
    });

    // Get repositories
    const answerRepo = this.dataSource.getRepository(Answer);
    const attReportRepo = this.dataSource.getRepository(AttReport);

    // Calculate totals for each salary report
    for (const report of data as SalaryReportWithTotals[]) {
      try {
        // Load related answers with question.tariff
        const answers = await answerRepo.find({
          where: { salaryReportId: report.id, userId },
          relations: ['question'],
        });

        // Calculate answers total (answer × question.tariff)
        report.answerCount = answers.length;
        report.answersTotal = roundToTwoDecimals(answers.reduce((sum, answer) => {
          const tariff = answer.question?.tariff || 0;
          return sum + (answer.answer * tariff);
        }, 0));

        // Load related att_reports with pricing information
        const attReports = await attReportRepo.find({
          where: { salaryReportId: report.id, userId },
          relations: ['teacher', 'teacher.teacherType'],
        });

        // Calculate att_reports total using pricing utility
        report.attReportCount = attReports.length;
        report.attReportsTotal = roundToTwoDecimals(attReports.reduce((sum, attReport) => {
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
        }, 0));

        // Calculate grand total
        report.grandTotal = roundToTwoDecimals((report.answersTotal || 0) + (report.attReportsTotal || 0));
      } catch (error) {
        console.error(`Failed to calculate totals for salary report ${report.id}:`, error);
        report.answersTotal = 0;
        report.attReportsTotal = 0;
        report.grandTotal = 0;
        report.answerCount = 0;
        report.attReportCount = 0;
      }
    }
  }
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export default getConfig();
