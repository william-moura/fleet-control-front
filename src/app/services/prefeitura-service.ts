import { HttpClient, HttpParams } from '@angular/common/http';
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
  private readonly API_URL_UPLOADS = environment.apiUrl + '/upload';
  getPrefeituras(indicePagina: number, pageSize: number): Observable<Pagination<Prefeitura>> {
    const params = new HttpParams()
    .set('page', (indicePagina + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', pageSize.toString());
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
  uploadPhotos(photos: FormData): Observable<Photo> {
    return this.http.post<Photo>(`${this.API_URL_UPLOADS}`, photos);
  }
  createPrefeitura(prefeitura: Prefeitura): Observable<Prefeitura> {
    return this.http.post<Prefeitura>(`${environment.apiUrl}/prefeituras`, prefeitura);
  }
  getNextRegistrationNumber(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/prefeituras-next-registration`);
  }
  updatePrefeitura(prefeitura: Prefeitura, id: number): Observable<Prefeitura> {
    return this.http.put<Prefeitura>(`${environment.apiUrl}/prefeituras/${id}`, prefeitura);
  }
  getPrefeituraById(id: number): Observable<Prefeitura> {
    return this.http.get<Prefeitura>(`${environment.apiUrl}/prefeituras/${id}`);
  }
  getNextRegistrationNumberOrgao(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/orgaos-next-registration`);
  }
  getOrgaoById(id: number): Observable<Orgao> {
    return this.http.get<Orgao>(`${environment.apiUrl}/orgaos/${id}`);
  }
  createOrgao(orgao: Orgao): Observable<Orgao> {
    return this.http.post<Orgao>(`${environment.apiUrl}/orgaos`, orgao);
  }
  updateOrgao(orgao: Orgao, id: number): Observable<Orgao> {
    return this.http.put<Orgao>(`${environment.apiUrl}/orgaos/${id}`, orgao);
  }
  getSecretariaById(id: number): Observable<Secretaria> {
    return this.http.get<Secretaria>(`${environment.apiUrl}/secretarias/${id}`);
  }
  getNextRegistrationNumberSecretaria(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/secretarias-next-registration`);
  }
  createSecretaria(secretaria: Secretaria): Observable<Secretaria> {
    return this.http.post<Secretaria>(`${environment.apiUrl}/secretarias`, secretaria);
  }
  updateSecretaria(secretaria: Secretaria, id: number): Observable<Secretaria> {
    return this.http.put<Secretaria>(`${environment.apiUrl}/secretarias/${id}`, secretaria);
  }
  getOrgaosByPrefeituraId(prefeituraId: number): Observable<Orgao[]> {
    return this.http.get<Orgao[]>(`${environment.apiUrl}/orgaos/prefeitura/${prefeituraId}`);
  }
}
