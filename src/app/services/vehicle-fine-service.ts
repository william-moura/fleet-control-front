import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pagination } from '../models/pagination';
import { VehicleFine } from '../models/vehicle-fine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleFineService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/vehicle-fines';
  getAllVehicleFines(page: number = 1, perPage: number = 10): Observable<Pagination<VehicleFine>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<VehicleFine>>(this.API_URL, { params });
  }
  getVehicleFineById(id: number): Observable<VehicleFine> {
    return this.http.get<VehicleFine>(`${this.API_URL}/${id}`);
  }
  createVehicleFine(vehicleFine: VehicleFine): Observable<VehicleFine> {
    return this.http.post<VehicleFine>(this.API_URL, vehicleFine);
  }
  updateVehicleFine(id: number, vehicleFine: VehicleFine): Observable<VehicleFine> {
    return this.http.put<VehicleFine>(`${this.API_URL}/${id}`, vehicleFine);
  }
  deleteVehicleFine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
