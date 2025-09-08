import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { ReportableItem } from '../db/view-entities/ReportableItem.entity';
import { AttReport } from '../db/entities/AttReport.entity';
import { Answer } from '../db/entities/Answer.entity';
import { SalaryReport } from '../db/entities/SalaryReport.entity';
import { In, IsNull } from 'typeorm';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: ReportableItem,
    service: ReportableItemService,
  };
}

class ReportableItemService<T extends Entity | ReportableItem> extends BaseEntityService<T> {
  async doAction(req: CrudRequest, body: any): Promise<any> {
    const extra = req.parsed.extra as any;
    const userId = getUserIdFromUser(req.auth);

    switch (extra?.action) {
      case 'assignToSalaryReport': {
        return this.assignItemsToSalaryReport(
          userId,
          extra.ids,
          {
            name: extra.salaryReportName,
            date: extra.salaryReportDate ? new Date(extra.salaryReportDate) : undefined,
            existingSalaryReportId: Number(extra.existingSalaryReportId)
          }
        );
      }

      default:
        return super.doAction(req, body);
    }
  }

  private async assignItemsToSalaryReport(
    userId: number,
    itemIds: string[],
    salaryReportData: {
      name?: string;
      date?: Date;
      existingSalaryReportId?: number;
    }
  ): Promise<SalaryReport> {
    const dataSource = this.dataSource;
    const attReportRepo = dataSource.getRepository(AttReport);
    const answerRepo = dataSource.getRepository(Answer);
    const salaryReportRepo = dataSource.getRepository(SalaryReport);

    let salaryReport: SalaryReport;

    // 1. Create new SalaryReport or use existing one
    if (salaryReportData.existingSalaryReportId && salaryReportData.existingSalaryReportId > 0) {
      salaryReport = await salaryReportRepo.findOneOrFail({
        where: { id: salaryReportData.existingSalaryReportId, userId }
      });
    } else {
      salaryReport = await salaryReportRepo.save({
        name: salaryReportData.name,
        date: salaryReportData.date,
        userId
      });
    }

    // 2. Parse and assign items
    const reportIds = itemIds
      .filter(id => id.startsWith('report_'))
      .map(id => parseInt(id.replace('report_', '')));

    const answerIds = itemIds
      .filter(id => id.startsWith('answer_'))
      .map(id => parseInt(id.replace('answer_', '')));

    // 3. Update AttReports
    if (reportIds.length > 0) {
      await attReportRepo.update(
        { id: In(reportIds), userId, salaryReportId: IsNull() },
        { salaryReportId: salaryReport.id }
      );
    }

    // 4. Update Answers
    if (answerIds.length > 0) {
      await answerRepo.update(
        { id: In(answerIds), userId, salaryReportId: IsNull() },
        { salaryReportId: salaryReport.id }
      );
    }

    return salaryReport;
  }
}

export default getConfig();
