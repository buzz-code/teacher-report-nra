import { CrudRequest } from '@dataui/crud';
import { getUserIdFromUser } from '@shared/auth/auth.util';
import { BaseEntityService } from '@shared/base-entity/base-entity.service';
import { getUserMailAddressFrom, validateUserHasPaid } from '@shared/base-entity/base-entity.util';
import { BaseEntityModuleOptions, Entity } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { getMailAddressForEntity } from '@shared/utils/mail/mail-address.util';
import { AttReport } from '../db/entities/AttReport.entity';
import { calculateReportPriceSafe, getPriceMapForUser, PriceExplanation } from '../utils/pricing.util';
import { buildExportHeadersForTeacherType } from '../utils/fieldsShow.util';
import { fixReferences } from '@shared/utils/entity/fixReference.util';
import { groupDataByKeys } from '../utils/reportData.util';
import { sendExcelReportToTeacher } from '../utils/mailReport.util';
import { In, Repository } from 'typeorm';

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
        const teacherTypeKey = teacherTypeFilter?.value && data?.length ? data[0]?.teacher?.teacherType?.key : null;

        return [
          { value: 'teacher.name', label: 'שם המורה' },
          { value: 'reportDate', label: 'תאריך דיווח' },
          { value: 'year', label: 'שנה' },
          ...buildExportHeadersForTeacherType(teacherTypeKey),
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

class AttReportPricingService<T extends Entity | AttReport> extends BaseEntityService<T> {
  async doAction(req: CrudRequest, body: any): Promise<any> {
    const extra = req.parsed.extra as any;

    switch (extra?.action) {
      case 'fixReferences': {
        const ids = extra.ids.toString().split(',').map(Number);
        return fixReferences(this.repo as Repository<AttReport>, ids, { teacherTz: 'teacherReferenceId' });
      }

      case 'teacherReportFile': {
        return this.handleTeacherReportFile(req, extra);
      }

      default:
        return super.doAction(req, body);
    }
  }

  private async handleTeacherReportFile(req: CrudRequest, extra: any): Promise<string> {
    const userId = getUserIdFromUser(req.auth);
    const ids = extra.ids.toString().split(',').map(Number);
    const { mailSubject, mailBody } = extra;

    // Get all reports with teacher relations
    const reports = await (this.repo as Repository<AttReport>).find({
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

  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any[], auth: any): Promise<void> {
    const data = list as AttReport[];

    switch (pivotName) {
      case 'AttReportWithPricing': {
        await this.handlePricingPivot(data, auth);
        break;
      }
    }
  }

  private async handlePricingPivot(data: AttReport[], auth: any): Promise<void> {
    const userId = getUserIdFromUser(auth);
    const priceMap = await getPriceMapForUser(userId, this.dataSource);

    // Calculate pricing for each report and update in place
    data.forEach((report: AttReportWithPricing) => {
      const teacherTypeKey = report.teacher?.teacherType?.key;
      const { price, explanation } = calculateReportPriceSafe(report, teacherTypeKey, priceMap, true);
      report.price = price;
      report.priceExplanation = explanation;
    });
  }
}

export default getConfig();
