import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Prefeitura } from '../models/prefeitura';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagination } from '../models/pagination';
import { Orgao } from '../models/orgao';
import { Secretaria } from '../models/secretaria';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root',
})
export class PrefeituraService {
  private http = inject(HttpClient);
  getPrefeituras(indicePagina: number, pageSize: number): Observable<Pagination<Prefeitura>> {
    return this.http.get<Pagination<Prefeitura>>(`${environment.apiUrl}/prefeituras?page=${indicePagina}&per_page=${pageSize}`);
  }
  deletePrefeitura(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/prefeituras/${id}`);
  }
  getOrgaos(indicePagina: number, pageSize: number): Observable<Pagination<Orgao>> {
    return this.http.get<Pagination<Orgao>>(`${environment.apiUrl}/orgaos?page=${indicePagina}&per_page=${pageSize}`);
  }
  deleteOrgao(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/orgaos/${id}`);
  }
  getSecretarias(indicePagina: number, pageSize: number): Observable<Pagination<Secretaria>> {
    return this.http.get<Pagination<Secretaria>>(`${environment.apiUrl}/secretarias?page=${indicePagina}&per_page=${pageSize}`);
  }
  deleteSecretaria(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/secretarias/${id}`);
  }
  uploadPhotos(formData: FormData): Observable<Photo> {
    return this.http.post<Photo>(`${environment.apiUrl}/prefeituras/upload-photos`, formData);
  }
}
