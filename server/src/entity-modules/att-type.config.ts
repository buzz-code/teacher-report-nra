import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { AttType } from 'src/db/entities/AttType.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: AttType,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<AttType> = getUserIdFilter(user);
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
        ];
      },
    },
  };
}

export default getConfig();