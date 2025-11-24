import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { IHeader } from '@shared/utils/exporter/types';
import { StudentGroup } from 'src/db/entities/StudentGroup.entity';
import { CrudRequest } from '@dataui/crud';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: StudentGroup,
    query: {
      join: {
        teacher: { eager: false },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          teacher: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        return [
          { value: 'teacherTz', label: 'ת.ז. מורה' },
          { value: 'teacher.name', label: 'שם מורה' },
          { value: 'startDate', label: 'מתאריך' },
          { value: 'endDate', label: 'עד תאריך' },
          { value: 'studentCount', label: 'מספר תלמידות' },
          { value: 'trainingTeacher', label: 'מורה מכשירה' },
        ];
      },
    },
  };
}

export default getConfig();
