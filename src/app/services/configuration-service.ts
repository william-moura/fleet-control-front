import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../models/configuration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/alert-settings';
  createConfiguration(configuration: Configuration): Observable<Configuration> {
    return this.http.post<Configuration>(this.API_URL, configuration);
  }
  getConfiguration(): Observable<Configuration> {
    return this.http.get<Configuration>(this.API_URL);
  }
}
