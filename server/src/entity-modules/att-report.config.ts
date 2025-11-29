import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { AttReport } from '../db/entities/AttReport.entity';
import { PriceByUser } from '../db/view-entities/PriceByUser.entity';
import { calculateAttendanceReportPriceWithExplanation, PriceExplanation } from '../utils/pricing.util';
import { buildHeadersForTeacherType, fieldTranslations, ITableHeader } from '../utils/fieldsShow.util';
import { fixReferences } from '@shared/utils/entity/fixReference.util';
import { Repository } from 'typeorm';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: AttReport,
    query: {
      join: {
        teacher: { eager: true },
        'teacher.teacherType': { eager: true },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          teacher: { eager: true },
          'teacher.teacherType': { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(entityColumns: string[], req: CrudRequest, data?: AttReport[]): IHeader[] {
        const teacherTypeFilter = req?.parsed?.filter?.find((f: any) => f.field === 'teacher.teacherTypeReferenceId');
        const teacherTypeKey = teacherTypeFilter?.value && data?.length
          ? data[0]?.teacher?.teacherType?.key
          : null;

        const dynamicHeaders = buildHeadersForTeacherType(teacherTypeKey);

        return [
          { value: 'teacher.name', label: 'שם המורה' },
          { value: 'reportDate', label: 'תאריך דיווח' },
          { value: 'year', label: 'שנה' },
          ...dynamicHeaders.map((header) => ({
            value: header.value,
            label: fieldTranslations[header.value] || header.value
          })),
        ];
      },
    },
    service: AttReportPricingService,
  };
}

interface AttReportWithPricing extends AttReport {
  price?: number;
  priceExplanation?: PriceExplanation;
}

interface AttReportWithHeaders extends AttReport {
  headers?: ITableHeader[];
}

class AttReportPricingService<T extends Entity | AttReport> extends BaseEntityService<T> {
  async doAction(req: CrudRequest, body: any): Promise<any> {
    const extra = req.parsed.extra as any;

    switch (extra?.action) {
      case 'fixReferences': {
        const ids = extra.ids.toString().split(',').map(Number);
        return fixReferences(this.repo as Repository<AttReport>, ids, { teacherTz: 'teacherReferenceId' });
      }

      default:
        return super.doAction(req, body);
    }
  }

  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any[], auth: any): Promise<void> {
    const data = list as AttReport[];

    switch (pivotName) {
      case 'AttReportWithPricing': {
        await this.handlePricingPivot(data, auth);
        break;
      }

      // TODO: Delete this pivot as not needed anymore
      case 'AttReportByTeacherType': {
        await this.handleTeacherTypePivot(data, extra, filter, auth);
        break;
      }
    }
  }

  private async handlePricingPivot(data: AttReport[], auth: any): Promise<void> {
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

    // Log loaded prices for debugging
    console.log(`Loaded ${prices.length} prices for user ${userId}`);

    // Calculate pricing for each report and update in place
    data.forEach((report: AttReportWithPricing) => {
      const teacherTypeId = report.teacher?.teacherType?.key;

      if (!teacherTypeId) {
        console.warn(`Report ${report.id} has no teacher type, skipping pricing`);
        report.price = 0;
        return;
      }

      try {
        // Calculate price using the semantic pricing utility with explanation
        const result = calculateAttendanceReportPriceWithExplanation(report, teacherTypeId, priceMap);
        report.price = result.price;
        report.priceExplanation = result.explanation;
      } catch (error) {
        console.error(`Failed to calculate price for report ${report.id}:`, error);
        report.price = 0;
      }
    });
  }

  private async handleTeacherTypePivot(data: AttReport[], extra: any, filter: any[], auth: any): Promise<void> {
    const teacherTypeId = filter?.find((f) => f.field === 'teacher.teacherTypeReferenceId')?.value || null;
    const headers = buildHeadersForTeacherType(teacherTypeId);
    if (data.length > 0) {
      (data[0] as any).headers = headers;
    }
  }
}

export default getConfig();
