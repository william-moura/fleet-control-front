import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Kilometer } from '../models/kilometer';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class KilometerService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/kilometers';
  createKilometer(vehicleId: number, kilometer: Kilometer): Observable<Kilometer> {
    return this.http.post<Kilometer>(`${this.API_URL}/${vehicleId}`, kilometer);
  }
  getKilometersByVehicleId(vehicleId: number): Observable<Kilometer[]> {
    return this.http.get<Kilometer[]>(`${this.API_URL}/${vehicleId}`);
  }
  getKilometers(page: number = 1, perPage: number = 10): Observable<Pagination<Kilometer>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<Kilometer>>(this.API_URL, { params });
  }
  deleteKilometer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  updateKilometer(id: number, kilometer: Kilometer): Observable<Kilometer> {
    return this.http.put<Kilometer>(`${this.API_URL}/${id}`, kilometer);
  }
  listKilometers(): Observable<Kilometer[]> {
    return this.http.get<Kilometer[]>(this.API_URL);
  }
}
