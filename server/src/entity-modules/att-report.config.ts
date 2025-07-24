import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { AttReport } from '../db/entities/AttReport.entity';
import { Price } from '../db/entities/Price.entity';
import { calculateAttendanceReportPrice } from '../utils/pricing.util';
import { getFieldsForTeacherType, shouldShowField } from '../utils/fieldsShow.util';

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
      getExportHeaders(): IHeader[] {
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

interface AttReportByTeacherType extends AttReport {
  price?: number;
  _meta?: {
    visibleFields: string[];
    teacherTypeId: number;
  };
}

class AttReportPricingService<T extends Entity | AttReport> extends BaseEntityService<T> {
  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any, auth: any): Promise<void> {
    const data = list as AttReport[];

    switch (pivotName) {
      case 'AttReportWithPricing': {
        // Get pricing data from Price entity
        const priceData = await this.dataSource.getRepository(Price).find({
          where: { userId: getUserIdFromUser(auth) },
        });

        // Calculate pricing for each report and update in place
        data.forEach((report: AttReportWithPricing) => {
          const teacherTypeId = report.teacher?.teacherTypeId;

          try {
            // Calculate price using the pricing utility
            const price = calculateAttendanceReportPrice(report, teacherTypeId, priceData);
            report.price = price;
          } catch (error) {
            console.warn(`Failed to calculate price for report ${report.id}:`, error.message);
            report.price = 0;
          }
        });
        break;
      }
      case 'AttReportByTeacherType': {
        // Get teacher type from filter or default to 1
        const teacherTypeId = filter?.teacherTypeId?.$eq || filter?.teacherTypeId || extra?.teacherTypeId || 1;

        // Get pricing data from Price entity
        const priceData = await this.dataSource.getRepository(Price).find({
          where: { userId: getUserIdFromUser(auth) },
        });

        // Get visible fields for this teacher type
        const visibleFields = getFieldsForTeacherType(teacherTypeId);

        // Calculate pricing for each report and add metadata
        data.forEach((report: AttReportByTeacherType) => {
          const reportTeacherTypeId = report.teacher?.teacherTypeId || teacherTypeId;

          try {
            // Calculate price using the pricing utility
            const price = calculateAttendanceReportPrice(report, reportTeacherTypeId, priceData);
            report.price = price;
          } catch (error) {
            console.warn(`Failed to calculate price for report ${report.id}:`, error.message);
            report.price = 0;
          }

          // Add metadata about visible fields
          report._meta = {
            visibleFields,
            teacherTypeId,
          };
        });
        break;
      }
    }
  }
}

export default getConfig();
