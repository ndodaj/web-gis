import { EnvironmentConfig } from '@core/models/environment-config';
declare let require: any;

export const environmentCommon: EnvironmentConfig = {
  cacheStorage: sessionStorage,
  production: false,
  configFile: '../assets/configs/configs.dev.json',
  loggedInUserCacheStorageKey: 'loggedInUser',
  loggedInUserCacheStorageKeyRole: 'permissions',
  appVersion: require('package.json')?.version,
  url: 'localhost:8080/geoserver/test/wms',
  geoportal_url: 'https://geoportal.asig.gov.al',
};
