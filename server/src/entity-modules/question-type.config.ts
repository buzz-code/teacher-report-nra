import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { QuestionType } from 'src/db/entities/QuestionType.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: QuestionType,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<QuestionType> = getUserIdFilter(user);
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
          { value: 'name', label: 'שם' },
        ];
      },
    },
  };
}

export default getConfig();