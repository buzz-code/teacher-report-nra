import { ReportableItem } from 'src/db/view-entities/ReportableItem.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../reportable-item.config';

createEntityConfigTests('ReportableItemConfig', config, {
  entity: ReportableItem,
});
