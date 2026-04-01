import { Price } from 'src/db/entities/Price.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../price.config';

createEntityConfigTests('PriceConfig', config, {
  entity: Price,
  expectedExportHeaders: {
    count: 3,
    first: { value: 'code', label: 'מזהה' },
  },
});
