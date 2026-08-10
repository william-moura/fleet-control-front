import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Travel } from '../models/travel';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  createTravel(travel: Travel): Observable<Travel> {
    return this.http.post<Travel>(`${this.apiUrl}/travels`, travel);
  }
  updateTravel(travel: Travel): Observable<Travel> {
    return this.http.put<Travel>(`${this.apiUrl}/travels/${travel.id}`, travel);
  }
  deleteTravel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/travels/${id}`);
  }
  getTravels(page: number = 1, perPage: number = 10): Observable<Pagination<Travel>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<Travel>>(`${this.apiUrl}/travels`, { params });
  }
  getTravel(id: number): Observable<Travel> {
    return this.http.get<Travel>(`${this.apiUrl}/travels/${id}`);
  }
}
