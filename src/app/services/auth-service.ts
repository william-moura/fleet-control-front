import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  // Usando Signals (novidade do Angular) para gerenciar o estado
  private isAuthenticatedSignal = signal<boolean>(!!localStorage.getItem('token'));

  isAuthenticated() {
    return this.isAuthenticatedSignal();
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.isAuthenticatedSignal.set(true);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }
}