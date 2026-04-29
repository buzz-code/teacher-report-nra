import { AttReport } from 'src/db/entities/AttReport.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../att-report.config';

createEntityConfigTests('AttReportConfig', config, {
  entity: AttReport,
  expectedJoins: {
    teacher: { eager: true },
    'teacher.teacherType': { eager: true },
  },
  expectedExportJoins: {
    teacher: { eager: true },
    'teacher.teacherType': { eager: true },
  },
  expectedExportHeaders: {
    first: { value: 'teacher.name', label: 'שם המורה' },
    includes: [
      { value: 'reportDate', label: 'תאריך דיווח' },
      { value: 'year', label: 'שנה' },
    ],
  },
});
