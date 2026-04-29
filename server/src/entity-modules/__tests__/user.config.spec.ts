import { User } from 'src/db/entities/User.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../user.config';

createEntityConfigTests('UserConfig', config, {
  entity: User,
});
