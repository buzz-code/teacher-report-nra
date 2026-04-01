import { ReportableItemWithPrice } from 'src/db/view-entities/ReportableItemWithPrice.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../reportable-item-with-price.config';

createEntityConfigTests('ReportableItemWithPriceConfig', config, {
  entity: ReportableItemWithPrice,
  expectedJoins: {
    teacher: { eager: false },
    'teacher.teacherType': { eager: false },
  },
});
