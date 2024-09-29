import { AppConfigService } from '@core/services/app-config.service';

/**
 * Base class for API services
 */
export class BaseService {
  constructor(protected config: AppConfigService) {}
  get apiUrl(): string {
    return this.config.api.baseUrl;
  }

  get entityUrl(): string {
    return `${this.config.api.baseUrl}`;
  }

  get geoserverUrl(): string {
    return `${this.config.geoserverUrl}`;
  }
}
