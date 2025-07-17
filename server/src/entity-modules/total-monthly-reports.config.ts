import { DeepPartial } from 'typeorm';
import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { AttReport } from '../db/entities/AttReport.entity';
import { getISODateFormatter } from '@shared/utils/formatting/formatter.util';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: AttReport,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: DeepPartial<AttReport> = getUserIdFilter(user);
      // No teacher type filter for total monthly reports - shows all types aggregated
      return userFilter;
    }),
    query: {
      join: {
        user: { eager: false },
        teacher: { eager: true },
        attType: { eager: false },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          user: { eager: true },
          teacher: { eager: true },
          attType: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        return [
          { value: 'id', label: 'מזהה' },
          { value: 'teacher.name', label: 'שם מורה' },
          { value: 'teacher.teacherType.name', label: 'סוג מורה' },
          { value: getISODateFormatter('reportDate'), label: 'תאריך דוח' },
          { value: 'year', label: 'שנה' },
          { value: 'salaryMonth', label: 'חודש משכורת' },
          { value: 'isConfirmed', label: 'אושר' },
          { value: 'howManyStudents', label: 'כמה תלמידים' },
          { value: 'howManyMethodic', label: 'כמה שיעורי מתודיקה' },
          { value: 'howManyWatchedLessons', label: 'כמה שיעורי צפייה' },
          { value: 'howManyDiscussingLessons', label: 'כמה שיעורי דיון' },
          { value: 'comment', label: 'הערות' },
        ];
      },
    },
  };
}

export default getConfig();