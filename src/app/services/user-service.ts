import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl + '/users';
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, user);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
