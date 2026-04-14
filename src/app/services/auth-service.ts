import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginCredentials } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { Role } from '../models/role';
import { Permission } from '../models/permission';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = environment.apiUrl + '/auth'; // URL do seu Backend
  private isAuthenticatedSignal = signal<boolean>(!!localStorage.getItem('token'));
  private userPermissions: Permission[] = [];
  private userRoles: Role[] = [];
  isAuthenticated() {
    return this.isAuthenticatedSignal();
  }

  // Signal para o estado global do usuário
  currentUser = signal<AuthResponse['user'] | null>(null);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        // 1. Salva o token para o Interceptor usar depois
        localStorage.setItem('token', res.token);
        
        // 2. Salva os dados do usuário no Signal para uso no menu/sidebar
        this.currentUser.set(res.user);
        this.isAuthenticatedSignal.set(true);
        this.setUserData(res.roles, res.permissions);
        
        // 3. Redireciona
        this.router.navigate(['dashboard']);
      }),
      catchError((error) => {
        // Tratamento genérico de erro de rede ou servidor
        console.error('Erro na requisição de login', error);
        return throwError(() => new Error('Falha na comunicação com o servidor.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`);
  }
  setUserData(roles: Role[], permissions: Permission[]) {
    this.userRoles = roles
    this.userPermissions = permissions
  }
  hasPermission(permission: string): boolean {
    this.userPermissions.forEach(p => {
      console.log(p.name, 'p.name');
    });
    console.log(this.userPermissions, 'pwer');
    return this.userPermissions.some(p => p.name === permission);
    // return this.userPermissions.includes(permission);
  }

  hasRole(role: Role): boolean {
    return this.userRoles.includes(role);
  }
}