import { ApiConfig } from './api-config';
import { ThemeConfig } from './theme-config';

export interface AppConfig {
  api: ApiConfig;
  theme: ThemeConfig;
  environmentName: string;
  geoserverUrl: string;
}
