import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { getUserMailAddressFrom, validateUserHasPaid } from '@shared/base-entity/base-entity.util';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { getMailAddressForEntity } from '@shared/utils/mail/mail-address.util';
import { AttReport } from '../db/entities/AttReport.entity';
import { AttReportWithPrice } from '../db/view-entities/AttReportWithPrice.entity';
import { calculateReportPriceSafe, getPriceMapForUser } from '../utils/pricing.util';
import { buildExportHeadersForTeacherType } from '../utils/fieldsShow.util';
import { groupDataByKeys } from '../utils/reportData.util';
import { sendExcelReportToTeacher } from '../utils/mailReport.util';
import { In } from 'typeorm';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: AttReportWithPrice,
    exporter: {
      getExportHeaders(entityColumns: string[], req: CrudRequest, data?: AttReportWithPrice[]): IHeader[] {
        const teacherTypeFilter = req?.parsed?.filter?.find((f: any) => f.field === 'teacherTypeReferenceId');
        const teacherTypeKey = teacherTypeFilter?.value && data?.length ? data[0]?.teacherTypeKey : null;

        return [
          { value: 'teacher.name', label: 'שם המורה' },
          { value: 'reportDate', label: 'תאריך דיווח' },
          { value: 'year', label: 'שנה' },
          ...buildExportHeadersForTeacherType(teacherTypeKey),
          { value: 'calculatedPrice', label: 'מחיר' },
        ];
      },
    },
    service: AttReportWithPriceService,
  };
}

interface AttReportWithPricing extends AttReport {
  price?: number;
}

/**
 * Service for AttReportWithPrice view entity.
 * Handles bulk actions like sending Excel reports to teachers.
 * Since this is a view, we need to fetch from the underlying AttReport table for actions.
 */
class AttReportWithPriceService<T extends Entity | AttReportWithPrice> extends BaseEntityService<T> {
  async doAction(req: CrudRequest, body: any): Promise<any> {
    const extra = req.parsed.extra as any;

    switch (extra?.action) {
      case 'teacherReportFile': {
        return this.handleTeacherReportFile(req, extra);
      }

      default:
        return super.doAction(req, body);
    }
  }

  /**
   * Handle sending Excel report files to teachers via email.
   * Fetches data from the underlying AttReport table since the view is read-only.
   */
  private async handleTeacherReportFile(req: CrudRequest, extra: any): Promise<string> {
    const userId = getUserIdFromUser(req.auth);
    const ids = extra.ids.toString().split(',').map(Number);
    const { mailSubject, mailBody } = extra;

    // Get all reports from the underlying AttReport table with teacher relations
    const attReportRepo = this.dataSource.getRepository(AttReport);
    const reports = await attReportRepo.find({
      where: { id: In(ids) },
      relations: ['teacher', 'teacher.teacherType'],
    });

    if (reports.length === 0) {
      return 'לא נמצאו דיווחים';
    }

    // Validate user has paid for bulk operations
    if (reports.length > 1) {
      await validateUserHasPaid(req.auth, this.dataSource, 'בחשבון חינמי אפשר לשלוח רק מייל אחד בכל פעם');
    }

    // Group reports by teacher
    const reportsByTeacher = groupDataByKeys(
      reports.filter((r) => r.teacherReferenceId),
      ['teacherReferenceId'],
    );

    const responses: string[] = [];
    const fromAddress = await getUserMailAddressFrom(req.auth, this.dataSource);
    const replyToAddress = await getMailAddressForEntity(userId, 'att_report', this.dataSource);

    for (const [teacherId, teacherReports] of Object.entries(reportsByTeacher)) {
      try {
        const teacher = teacherReports[0].teacher;
        if (!teacher) {
          responses.push(`מורה ${teacherId} - לא נמצא`);
          continue;
        }

        if (!teacher.email) {
          responses.push(`${teacher.name} - אין כתובת מייל`);
          continue;
        }

        // Get headers based on teacher type
        const teacherTypeKey = teacher.teacherType?.key;
        const headers: IHeader[] = [
          { value: 'reportDate', label: 'תאריך דיווח' },
          { value: 'year', label: 'שנה' },
          ...buildExportHeadersForTeacherType(teacherTypeKey),
          { value: 'price', label: 'מחיר' },
        ];

        // Calculate prices for reports
        const priceMap = await getPriceMapForUser(userId, this.dataSource);

        teacherReports.forEach((report: AttReportWithPricing) => {
          const { price } = calculateReportPriceSafe(report, teacherTypeKey, priceMap);
          report.price = price;
        });

        // Generate Excel and send email
        await sendExcelReportToTeacher(this.mailSendService, {
          teacherName: teacher.name,
          teacherEmail: teacher.email,
          mailSubject,
          mailBody,
          headers,
          data: teacherReports,
          fromAddress,
          replyToAddress,
        });

        responses.push(`${teacher.name} - נשלח בהצלחה (${teacherReports.length} דיווחים)`);
      } catch (e) {
        console.error('Error sending teacher report file:', e);
        responses.push(`מורה ${teacherId} - שגיאה בשליחה`);
      }
    }

    return 'סטטוס מיילים:\n' + responses.join('\n');
  }
}

export default getConfig();
