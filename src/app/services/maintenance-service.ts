import { inject, Injectable } from '@angular/core';
import { Maintenance } from '../models/maintenance';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/maintenance-controls';
  getAllMaintenances(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(this.API_URL);
  }
  getMaintenanceById(id: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${this.API_URL}/${id}`);
  }
  createMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    return this.http.post<Maintenance>(this.API_URL, maintenance);
  }
  updateMaintenance(id: number, maintenance: Maintenance): Observable<Maintenance> {
    return this.http.put<Maintenance>(`${this.API_URL}/${id}`, maintenance);
  }
  deleteMaintenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
