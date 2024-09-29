export interface EnvironmentConfig {
  cacheStorage: Storage;
  loggedInUserCacheStorageKey: string;
  loggedInUserCacheStorageKeyRole?: string;
  production?: boolean;
  configFile?: string;
  appVersion?: string;
  url?: string;
  geoportal_url?: string;
  urlRedirect?: string;
}
