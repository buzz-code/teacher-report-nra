import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { SalaryReport } from 'src/db/entities/SalaryReport.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: SalaryReport,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<SalaryReport> = getUserIdFilter(user);
      return userFilter;
    }),
    query: {
      join: {
        user: { eager: false },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          user: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        return [
          { value: 'name', label: 'שם' },
          { value: 'date', label: 'תאריך' },
          { value: 'ids', label: 'מזהי דוחות' },
        ];
      },
    },
  };
}

export default getConfig();