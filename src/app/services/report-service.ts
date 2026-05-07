import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/reports';
  getDados(id: string, filtros: any): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`, { params: filtros });
  }
}
