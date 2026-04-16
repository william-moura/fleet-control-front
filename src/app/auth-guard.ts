import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Pegamos a permissão ou role necessária definida na rota
  const expectedPermission = route.data['permission'];

  if (authService.hasPermission(expectedPermission)) {
    return true;
  }

  // Se não tiver permissão, redireciona para página de "Acesso Negado"
  router.navigate(['/unauthorized']);
  return false;
}
