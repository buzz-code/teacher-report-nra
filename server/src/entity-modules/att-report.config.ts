import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { AttReport } from '../db/entities/AttReport.entity';
import { Price } from '../db/entities/Price.entity';
import { calculateAttendanceReportPrice } from '../utils/pricing.util';
import { buildHeadersForTeacherType, ITableHeader } from '../utils/fieldsShow.util';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: AttReport,
    query: {
      join: {
        teacher: { eager: true },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          teacher: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(entityColumns: string[]): IHeader[] {
        // For dynamic teacher type exports, we would need the request context
        // but it's not available in this signature. Fall back to default headers
        return [
          { value: 'teacher.name', label: 'שם המורה' },
          { value: 'reportDate', label: 'תאריך דיווח' },
          { value: 'year', label: 'שנה' },
          { value: 'howManyStudents', label: 'מספר תלמידים' },
          { value: 'howManyLessons', label: 'מספר שיעורים' },
          { value: 'price', label: 'מחיר' },
        ];
      },
    },
    service: AttReportPricingService,
  };
}

interface AttReportWithPricing extends AttReport {
  price?: number;
}

interface AttReportWithHeaders extends AttReport {
  headers?: ITableHeader[];
}

class AttReportPricingService<T extends Entity | AttReport> extends BaseEntityService<T> {
  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any[], auth: any): Promise<void> {
    const data = list as AttReport[];

    switch (pivotName) {
      case 'AttReportWithPricing': {
        await this.handlePricingPivot(data, auth);
        break;
      }

      case 'AttReportByTeacherType': {
        await this.handleTeacherTypePivot(data, extra, filter, auth);
        break;
      }
    }
  }

  private async handlePricingPivot(data: AttReport[], auth: any): Promise<void> {
    // Get pricing data from Price entity
    const priceData = await this.dataSource.getRepository(Price).find({
      where: { userId: getUserIdFromUser(auth) },
    });

    // Calculate pricing for each report and update in place
    data.forEach((report: AttReportWithPricing) => {
      const teacherTypeId = report.teacher?.teacherTypeKey;

      try {
        // Calculate price using the pricing utility
        const price = calculateAttendanceReportPrice(report, teacherTypeId, priceData);
        report.price = price;
      } catch (error) {
        console.warn(`Failed to calculate price for report ${report.id}:`, error.message);
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
