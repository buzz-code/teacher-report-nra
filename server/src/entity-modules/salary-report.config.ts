import { BaseEntityModuleOptions } from '@shared/base-entity/interface';
import { SalaryReport } from '../db/entities/SalaryReport.entity';

function getConfig(): BaseEntityModuleOptions {
  return {
    entity: SalaryReport,
  };
}

export default getConfig();
