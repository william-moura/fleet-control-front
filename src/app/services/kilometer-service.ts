import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Kilometer } from '../models/kilometer';

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
}
