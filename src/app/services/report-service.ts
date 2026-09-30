import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/reports';
  getDados(id: string, filtros: any): Observable<any> {
    let params = new HttpParams();
    if (filtros.vehicleId) {
      filtros.vehicleId.forEach((vehicle: number) => {
        params = params.append('vehicleId[]', vehicle.toString());
      });
    }
    if (filtros.startDate) params = params.set('startDate', filtros.startDate);
    if (filtros.endDate) params = params.set('endDate', filtros.endDate);
    if (filtros.driverId) params = params.set('driverId', filtros.driverId.toString());
    if (filtros.brandId) params = params.set('brandId', filtros.brandId.toString());
    console.log(params, 'params')
    return this.http.get<any>(`${this.API_URL}/${id}`, { params });
  }
}
