import { EnvironmentConfig } from '@core/models/environment-config';
import { environmentCommon } from 'src/environments/environment.common';

export const environment: EnvironmentConfig = {
  ...environmentCommon,
  production: true,
  cacheStorage: localStorage,
  configFile: '../assets/configs/configs.prod.json'
};
