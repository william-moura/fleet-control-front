import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginCredentials } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { Role } from '../models/role';
import { Permission } from '../models/permission';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = environment.apiUrl + '/auth'; // URL do seu Backend
  private isAuthenticatedSignal = signal<boolean>(!!localStorage.getItem('token'));
  private userPermissions = signal<string[]>([]);
  private userRoles = signal<string[]>([]);
  permissions = signal<string[]>(this.getPermissionsFromStorage());
  user = signal<User | null>(null);

  private getPermissionsFromStorage(): string[] {
    const p = localStorage.getItem('permissions');
    return p ? JSON.parse(p) : [];
  }

  setSession(authRes: any) {
    localStorage.setItem('token', authRes.token);
    localStorage.setItem('permissions', JSON.stringify(authRes.permissions.map((permission: Permission) => permission.name)));
    
    // 🔥 PASSO CRÍTICO: Atualiza o Signal. 
    // Isso notificará instantaneamente todas as diretivas *hasPermission no HTML.
    // permissions.map(permission => permission.name
    // this.permissions.set(authRes.user.permissions);
    this.permissions.set(authRes.permissions.map((permission: Permission) => permission.name));
    this.user.set(authRes.user);
  }
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
        if (res.role && res.permissions) {
          this.setUserData(res.role, res.permissions);
        }
        if (res.permissions) {
          this.setSession(res);
        }
        // 3. Redireciona
        console.log('ta vindo pro redirect');
        this.router.navigate(['kilometers']);
        console.log('ta vindo pro redirect 2');
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
    localStorage.removeItem('permissions');
    localStorage.removeItem('roles');
    this.currentUser.set(null);
    localStorage.clear();
    // 🔥 PASSO CRÍTICO: Limpa o Signal no Logout
    this.permissions.set([]); 
    this.router.navigate(['/login']);
  }
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_URL}/roles`);
  }
  setUserData(roles: Role[], permissions: Permission[]) {
    this.userRoles.set(roles.map(role => role.name));
    this.userPermissions.set(permissions.map(permission => permission.name));
    localStorage.setItem('permissions', JSON.stringify(this.userPermissions()));
    localStorage.setItem('roles', JSON.stringify(this.userRoles()));
  }
  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  hasRole(role: Role): boolean {
    return this.userRoles().includes(role.name);
  }
}