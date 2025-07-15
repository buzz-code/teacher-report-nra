import { connectToOpenobserve } from '@shared/utils/openobserveRumUtil';
import packageJson from '../package.json';

const options = {
    clientToken: '32363366626236332d333131632d343665642d616433372d316332366563386566313330',
    applicationId: 'event-yoman-online',
    site: 'api.openobserve.ai',
    service: 'event-frontend',
    env: location.href.includes('dev') || location.href.includes('localhost') ? 'development' : 'production',
    version: packageJson.version,
    organizationIdentifier: 'hadasa_organization_50794_yN95E6myGED9AWO',
    insecureHTTP: false,
    apiVersion: 'v1',
};

connectToOpenobserve(options);
