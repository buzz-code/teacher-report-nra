import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { WorkingDate } from 'src/db/entities/WorkingDate.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: WorkingDate,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<WorkingDate> = getUserIdFilter(user);
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
          { value: 'teacherTypeId', label: 'סוג מורה' },
          { value: 'workingDate', label: 'תאריך עבודה' },
        ];
      },
    },
  };
}

export default getConfig();