import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { Price } from 'src/db/entities/Price.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: Price,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<Price> = getUserIdFilter(user);
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
          { value: 'key', label: 'מפתח' },
          { value: 'price', label: 'מחיר' },
        ];
      },
    },
  };
}

export default getConfig();