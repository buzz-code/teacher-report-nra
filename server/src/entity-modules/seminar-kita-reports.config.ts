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
      // Filter by teacher type 1 (Seminar Kita)
      userFilter['teacher.teacherTypeId'] = 1;
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
          { value: getISODateFormatter('reportDate'), label: 'תאריך דוח' },
          { value: 'year', label: 'שנה' },
          { value: 'isConfirmed', label: 'אושר' },
          { value: 'howManyStudents', label: 'כמה תלמידים' },
          { value: 'howManyMethodic', label: 'כמה שיעורי מתודיקה' },
          { value: 'howManyWatchedLessons', label: 'כמה שיעורי צפייה' },
          { value: 'howManyLessonsAbsence', label: 'כמה שיעורי היעדרות' },
          { value: 'howManyDiscussingLessons', label: 'כמה שיעורי דיון' },
          { value: 'wasKamal', label: 'היה כמל' },
          { value: 'comment', label: 'הערות' },
        ];
      },
    },
  };
}

export default getConfig();