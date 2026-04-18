import { inject, Injectable } from '@angular/core';
import { Supplier } from '../models/supplier';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SupplierType } from '../models/supplier-type';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/suppliers';
  getAllSuppliers(supplierType?: SupplierType, page: number = 1, perPage: number = 10): Observable<Pagination<Supplier>> {
    const params = new HttpParams()
    .set('page', (page + 1).toString()) // MatPaginator começa em 0, Laravel em 1
    .set('per_page', perPage.toString());
    return this.http.get<Pagination<Supplier>>(`${this.API_URL}${supplierType ? `?supplierType=${supplierType}` : ''}`, { params });
  }
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.API_URL}/${id}`);
  }
  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.API_URL, supplier);
  }
  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.API_URL}/${id}`, supplier);
  }
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  getSupliersType(): Observable<SupplierType[]> {
    return this.http.get<SupplierType[]>(`${this.API_URL}/supplier-types`);
  }
}
