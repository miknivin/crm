import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { authGuard } from './guards/auth.guard';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthService } from './services/auth/auth.service';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    AuthService,
    provideHttpClient(),
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
