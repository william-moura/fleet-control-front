import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Vehicle } from '../models/vehicle';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { FuelType } from '../models/fuel-type';
import { environment } from '../../environments/environment';
import { Driver } from '../models/driver';
import { Pagination } from '../models/pagination';
import { Kilometer } from '../models/kilometer';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/vehicles';
  getAllVehicles(page: number = 1, perPage: number = 10): Observable<Pagination<Vehicle>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<Vehicle>>(this.API_URL, { params });
  }
  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.API_URL}/${id}`);
  }
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.API_URL, vehicle);
  }
  updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.API_URL}/${id}`, vehicle);
  }
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.API_URL}/brands`);
  }
  getFuelTypes(): Observable<FuelType[]> {
    return this.http.get<FuelType[]>(`${this.API_URL}/fuel-types`);
  }
  syncDrivers(vehicleId: number, driversIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${vehicleId}/sync-driver`, driversIds);
  }
  getDriversByVehicleId(vehicleId: number): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.API_URL}/${vehicleId}/drivers`);
  }
  createKilometer(vehicleId: number, kilometer: Kilometer): Observable<Kilometer> {
    return this.http.post<Kilometer>(`${this.API_URL}/${vehicleId}/kilometers`, kilometer);
  }
}
