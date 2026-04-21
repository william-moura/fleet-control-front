import { inject, Injectable } from '@angular/core';
import { Cep } from '../models/cep';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://brasilapi.com.br/api/cep/v2';
  getCep(cep: string): Observable<Cep> {
    return this.http.get<Cep>(`${this.API_URL}/${cep}`);
  }
}
