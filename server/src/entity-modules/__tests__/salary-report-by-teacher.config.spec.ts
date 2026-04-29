import { SalaryReportByTeacher } from 'src/db/view-entities/SalaryReportByTeacher.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../salary-report-by-teacher.config';

createEntityConfigTests('SalaryReportByTeacherConfig', config, {
  entity: SalaryReportByTeacher,
  expectedJoins: {
    teacher: { eager: false },
    'teacher.teacherType': { eager: false },
    salaryReport: { eager: false },
  },
  expectedExportJoins: {
    teacher: { eager: true },
    'teacher.teacherType': { eager: true },
    salaryReport: { eager: true },
  },
  expectedExportHeaders: {
    count: 10,
    first: { value: 'teacher.tz', label: 'ת.ז. מורה' },
  },
});
