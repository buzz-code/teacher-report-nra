import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { SalaryReportByTeacher } from '../db/view-entities/SalaryReportByTeacher.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: SalaryReportByTeacher,
    query: {
      join: {
        teacher: { eager: false },
        'teacher.teacherType': { eager: false },
        salaryReport: { eager: false },
      },
    },
  };
}

export default getConfig();
