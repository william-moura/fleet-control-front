import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceServiceModel } from '../models/maintenance-service-model';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceTypeService {
  private readonly API_URL = environment.apiUrl + '/maintenance-services';
  private http = inject(HttpClient);
    getAllMaintenanceTypes(page: number = 1, perPage: number = 10): Observable<Pagination<MaintenanceServiceModel>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<MaintenanceServiceModel>>(this.API_URL, { params });
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
