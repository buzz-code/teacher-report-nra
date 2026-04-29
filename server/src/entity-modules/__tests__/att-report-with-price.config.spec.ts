import { AttReportWithPrice } from 'src/db/view-entities/AttReportWithPrice.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../att-report-with-price.config';

createEntityConfigTests('AttReportWithPriceConfig', config, {
  entity: AttReportWithPrice,
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
    count: 7,
    first: { value: 'teacher.tz', label: 'ת.ז. מורה' },
    includes: [
      { value: 'teacher.name', label: 'שם המורה' },
      { value: 'calculatedPrice', label: 'סה"כ מחיר' },
    ],
  },
});
