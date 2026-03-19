import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { FuelType } from '../models/fuel-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/vehicles';
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.API_URL);
  }
  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.API_URL}/${id}`);
  }
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.API_URL, vehicle);
  }
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(this.API_URL, vehicle);
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
}
