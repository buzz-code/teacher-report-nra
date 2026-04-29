import { SalaryReport } from 'src/db/entities/SalaryReport.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../salary-report.config';

createEntityConfigTests('SalaryReportConfig', config, {
  entity: SalaryReport,
});
