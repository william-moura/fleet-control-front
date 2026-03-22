import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Driver } from '../models/driver';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/drivers';
  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.API_URL);
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
