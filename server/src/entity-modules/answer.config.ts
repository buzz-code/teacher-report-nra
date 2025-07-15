import { CrudRequest } from '@dataui/crud';
import { CrudAuthCustomFilter, getUserIdFilter } from '@shared/auth/crud-auth.filter';
import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { Answer } from 'src/db/entities/Answer.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: Answer,
    crudAuth: CrudAuthCustomFilter((user) => {
      const userFilter: Partial<Answer> = getUserIdFilter(user);
      return userFilter;
    }),
    query: {
      join: {
        user: { eager: false },
        teacher: { eager: false },
        question: { eager: false },
        report: { eager: false },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          user: { eager: true },
          teacher: { eager: true },
          question: { eager: true },
          report: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        return [
          { value: 'teacher.name', label: 'מורה' },
          { value: 'question.content', label: 'שאלה' },
          { value: 'answer', label: 'תשובה' },
          { value: 'answerDate', label: 'תאריך תשובה' },
        ];
      },
    },
  };
}

export default getConfig();