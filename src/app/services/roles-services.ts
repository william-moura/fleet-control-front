import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../models/role';
import { Pagination } from '../models/pagination';
import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root',
})
export class RolesServices {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/roles';
  getRoles(page: number = 1, perPage: number = 10): Observable<Pagination<Role>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<Role>>(this.API_URL, { params });
  }
  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/${id}`);
  }
  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.API_URL, role);
  }
  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.API_URL}/${id}`, role);
  }
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.API_URL}/all-permissions`);
  }
}
