import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor'; // O interceptor que criamos antes
import localePt from '@angular/common/locales/pt';

import { routes } from './app.routes';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';
import { registerLocaleData } from '@angular/common';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';


export const MY_LUXON_FORMATS = {
  parse: {
    // Permite que o Angular interprete o texto digitado no formato brasileiro
    dateInput: 'dd/MM/yyyy', 
  },
  display: {
    // Formato de exibição visual dentro do input
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

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
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideLuxonDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_LUXON_FORMATS }
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
