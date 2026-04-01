import { PaymentTrack } from '@shared/entities/PaymentTrack.entity';
import { createEntityConfigTests } from '@shared/utils/testing/entity-config-tester';
import config from '../payment-track.config';

createEntityConfigTests('PaymentTrackConfig', config, {
  entity: PaymentTrack,
});
