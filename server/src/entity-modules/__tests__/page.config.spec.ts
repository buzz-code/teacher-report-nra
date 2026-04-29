import { Page } from '@shared/entities/Page.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../page.config';

createEntityConfigTests('PageConfig', config, {
  entity: Page,
});
