import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { Question } from 'src/db/entities/Question.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: Question,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<Question> = getUserIdFilter(user);
      return userFilter;
    }),
    query: {
      join: {
        user: { eager: false },
        questionType: { eager: false },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          user: { eager: true },
          questionType: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        return [
          { value: 'content', label: 'תוכן שאלה' },
          { value: 'teacherTypeId', label: 'סוג מורה' },
          { value: 'questionType.name', label: 'סוג שאלה' },
          { value: 'isStandalone', label: 'עצמאית' },
          { value: 'startDate', label: 'תאריך התחלה' },
          { value: 'endDate', label: 'תאריך סיום' },
        ];
      },
    },
  };
}

export default getConfig();