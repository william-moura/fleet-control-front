import { inject, Injectable } from '@angular/core';
import { Supplier } from '../models/supplier';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SupplierType } from '../models/supplier-type';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/suppliers';
  getAllSuppliers(supplierType?: SupplierType): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.API_URL}${supplierType ? `?supplierType=${supplierType}` : ''}`);
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
}
