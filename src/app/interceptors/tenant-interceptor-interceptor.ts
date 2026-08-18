import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant-service';

export const tenantInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  const tenant = tenantService.currentTenant();
  if (tenant) {
    const clonedReq = req.clone({
      setHeaders: {
        'X-Tenant': tenant,
      },
    });
    return next(clonedReq);
  }
  return next(req);
};
