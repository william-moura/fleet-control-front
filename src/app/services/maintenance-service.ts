import { inject, Injectable } from '@angular/core';
import { Maintenance } from '../models/maintenance';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MaintenanceServiceModel } from '../models/maintenance-service-model';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/maintenance-controls';
  private readonly API_URL_SERVICES = environment.apiUrl + '/maintenance-services';
  getAllMaintenances(indicePagina: number, pageSize: number): Observable<Pagination<Maintenance>> {
    const params = new HttpParams()
    .set('page', (indicePagina + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', pageSize.toString());
    return this.http.get<Pagination<Maintenance>>(this.API_URL, { params });
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
  createMaintenanceService(maintenanceService: MaintenanceServiceModel): Observable<MaintenanceServiceModel> {
    return this.http.post<MaintenanceServiceModel>(this.API_URL_SERVICES, maintenanceService);
  }
  updateMaintenanceService(id: number, maintenanceService: MaintenanceServiceModel): Observable<MaintenanceServiceModel> {
    return this.http.put<MaintenanceServiceModel>(`${this.API_URL_SERVICES}/${id}`, maintenanceService);
  }
  deleteMaintenanceService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL_SERVICES}/${id}`);
  }
  getAllMaintenanceServices(): Observable<MaintenanceServiceModel[]> {
    return this.http.get<MaintenanceServiceModel[]>(this.API_URL_SERVICES);
  }
  getMaintenanceServiceById(id: number): Observable<MaintenanceServiceModel> {
    return this.http.get<MaintenanceServiceModel>(`${this.API_URL_SERVICES}/${id}`);
  }
  getMaintenanceServicesByMaintenanceId(maintenanceId: number): Observable<MaintenanceServiceModel[]> {
    return this.http.get<MaintenanceServiceModel[]>(`${this.API_URL_SERVICES}/maintenance/${maintenanceId}`);
  }
}
