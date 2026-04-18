import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Driver } from '../models/driver';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/drivers';
  getAllDrivers(page: number = 1, perPage: number = 10): Observable<Pagination<Driver>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<Driver>>(this.API_URL, { params });
  }
  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.API_URL}/${id}`);
  }
  createDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.API_URL, driver);
  }
  updateDriver(id: number, driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.API_URL}/${id}`, driver);
  }
  deleteDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
