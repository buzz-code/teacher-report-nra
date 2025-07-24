import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { AttReport } from '../db/entities/AttReport.entity';
import { Price } from '../db/entities/Price.entity';
import { TeacherType } from '../db/entities/TeacherType.entity';
import { Teacher } from '../db/entities/Teacher.entity';
import { calculateAttendanceReportPrice } from '../utils/pricing.util';
import { TeacherTypeId } from '../utils/fieldsShow.util';
import { In } from 'typeorm';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: AttReport,
    query: {
      join: {
        teacher: {},
        attType: {},
        user: {},
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          teacher: { eager: true },
          attType: { eager: true },
          user: { eager: true },
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

class AttReportPricingService<T extends Entity | AttReport> extends BaseEntityService<T> {
  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any, auth: any): Promise<void> {
    const data = list as AttReport[];

    switch (pivotName) {
      case 'AttReportWithPricing': {
        // Get pricing data from Price entity
        const priceData = await this.dataSource.getRepository(Price).find({
          where: { userId: getUserIdFromUser(auth) },
        });

        // Convert price data to the format expected by pricing utility
        const priceMap = priceData.map((price) => ({
          key: price.id,
          price: price.price,
        }));

        // Get teacher types for each unique teacher ID
        const teacherIds = [...new Set(data.map((report) => report.teacherId))];
        const teachers = await this.dataSource.getRepository(Teacher).find({
          where: { id: In(teacherIds) },
        });
        const teacherMap = teachers.reduce((acc, teacher) => {
          acc[teacher.id] = teacher;
          return acc;
        }, {});

        // Calculate pricing for each report and update in place
        data.forEach((report: AttReportWithPricing) => {
          const teacher = teacherMap[report.teacherId];
          const teacherTypeId = teacher?.teacherTypeId || TeacherTypeId.SEMINAR_KITA; // Default fallback

          try {
            // Calculate price using the pricing utility
            const price = calculateAttendanceReportPrice(report, teacherTypeId, priceMap);
            report.price = price;
          } catch (error) {
            console.warn(`Failed to calculate price for report ${report.id}:`, error.message);
            report.price = 0; // Fallback price
          }
        });
        break;
      }
    }
  }
}

export default getConfig();
