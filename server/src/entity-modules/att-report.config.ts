import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { AttReport } from 'src/db/entities/AttReport.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: AttReport,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<AttReport> = getUserIdFilter(user);
      return userFilter;
    }),
    query: {
      join: {
        user: { eager: false },
        teacher: { eager: false },
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
          { value: 'teacher.name', label: 'מורה' },
          { value: 'reportDate', label: 'תאריך דיווח' },
          { value: 'year', label: 'שנה' },
          { value: 'isConfirmed', label: 'מאושר' },
          { value: 'howManyStudents', label: 'כמות תלמידים' },
          { value: 'comment', label: 'הערות' },
        ];
      },
    },
  };
}

export default getConfig();