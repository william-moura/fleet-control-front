import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor'; // O interceptor que criamos antes
import localePt from '@angular/common/locales/pt';

import { routes } from './app.routes';
import { MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Envia o token automaticamente para a API
    ),
    provideNativeDateAdapter(),
    provideEnvironmentNgxMask(),
    provideNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
