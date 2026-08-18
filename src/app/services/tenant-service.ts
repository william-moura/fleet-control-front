import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TenantService {
  currentTenant = signal<string | null>(this.extractTenantFromUrl());

  private extractTenantFromUrl(): string | null {
    const hostname = window.location.hostname; // ex: salvador.localhost ou salvador.suaempresa.com
    const parts = hostname.split('.');

    if (hostname.includes('localhost') && parts.length === 2) {
      return parts[0]; // Retorna "salvador" de "salvador.localhost"
    }

    if (parts.length > 2) {
      return parts[0]; // Retorna "salvador" de "salvador.suaempresa.com"
    }

    return null;
  }
}