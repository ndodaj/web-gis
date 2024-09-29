import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { AppConfig } from '@core/models/app-config';
import { Observable } from 'rxjs';
import { ThemeConfigService } from './theme-config.service';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config!: AppConfig;

  constructor(
    private http: HttpClient,
    private themeConfigService?: ThemeConfigService
  ) {}

  getConfig(): AppConfig {
    return this.config;
  }

  loadConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>(`${environment.configFile}`).pipe(
      tap((response) => {
        this.config = response;
        if (this.config.theme) {
          this.themeConfigService?.updateConfig(this.config.theme);
        }
      })
    );
  }

  get api() {
    return this.getConfig()?.api;
  }

  get theme() {
    return this.getConfig()?.theme;
  }

  get environmentName() {
    return this.getConfig()?.environmentName;
  }
  get geoserverUrl() {
    return this.getConfig()?.geoserverUrl;
  }
}
