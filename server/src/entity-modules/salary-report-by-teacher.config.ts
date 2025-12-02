import { CrudRequest } from '@dataui/crud';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { SalaryReportByTeacher } from '../db/view-entities/SalaryReportByTeacher.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: SalaryReportByTeacher,
    query: {
      join: {
        teacher: { eager: false },
        'teacher.teacherType': { eager: false },
        salaryReport: { eager: false },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          teacher: { eager: true },
          'teacher.teacherType': { eager: true },
          salaryReport: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        return [
          { value: 'teacher.tz', label: 'ת.ז. מורה' },
          { value: 'teacher.name', label: 'שם המורה' },
          { value: 'salaryReport.name', label: 'דוח שכר' },
          { value: 'answerCount', label: 'מספר תשובות' },
          { value: 'attReportCount', label: 'מספר דיווחי נוכחות' },
          { value: 'answersTotal', label: 'סה"כ תשובות' },
          { value: 'attReportsTotal', label: 'סה"כ דיווחים' },
          { value: 'grandTotal', label: 'סה"כ' },
        ];
      },
    },
  };
}

export default getConfig();
