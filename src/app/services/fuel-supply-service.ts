import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FuelSupply } from '../models/fuel-supply';

@Injectable({
  providedIn: 'root',
})
export class FuelSupplyService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/fuel-suppliers';
  getAllFuelSupplies(): Observable<FuelSupply[]> {
    return this.http.get<FuelSupply[]>(this.API_URL);
  }
  getFuelSupplyById(id: number): Observable<FuelSupply> {
    return this.http.get<FuelSupply>(`${this.API_URL}/${id}`);
  }
  createFuelSupply(fuelSupply: FuelSupply): Observable<FuelSupply> {
    return this.http.post<FuelSupply>(this.API_URL, fuelSupply);
  }
  updateFuelSupply(id: number, fuelSupply: FuelSupply): Observable<FuelSupply> {
    return this.http.put<FuelSupply>(`${this.API_URL}/${id}`, fuelSupply);
  }
  deleteFuelSupply(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
