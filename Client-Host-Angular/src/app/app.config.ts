import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';

import { routes } from './app.routes';

/**
 * Configuración global de la aplicación (Host).
 * Proporciona manejo de errores globales, detección de zona con coalescencia de eventos,
 * enrutamiento y cliente HTTP compartido para los microfrontends.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
