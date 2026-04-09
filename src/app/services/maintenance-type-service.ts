import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceServiceModel } from '../models/maintenance-service-model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceTypeService {
  private readonly API_URL = environment.apiUrl + '/maintenance-services';
  private http = inject(HttpClient);
  getAllMaintenanceTypes(): Observable<MaintenanceServiceModel[]> {
    return this.http.get<MaintenanceServiceModel[]>(this.API_URL);
  }
  getMaintenanceTypeById(id: number): Observable<MaintenanceServiceModel> {
    return this.http.get<MaintenanceServiceModel>(`${this.API_URL}/${id}`);
  }
  createMaintenanceType(maintenanceType: MaintenanceServiceModel): Observable<MaintenanceServiceModel> {
    return this.http.post<MaintenanceServiceModel>(this.API_URL, maintenanceType);
  }
  updateMaintenanceType(id: number, maintenanceType: MaintenanceServiceModel): Observable<MaintenanceServiceModel> {
    return this.http.put<MaintenanceServiceModel>(`${this.API_URL}/${id}`, maintenanceType);
  }
  deleteMaintenanceType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
