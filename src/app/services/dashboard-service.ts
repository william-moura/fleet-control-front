import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dashboard } from '../models/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/dashboard';
  getDashboard(): Observable<Dashboard> {

    return this.http.get<Dashboard>(this.API_URL);
  }
}
