import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente raíz de la aplicación.
 *
 * @remarks
 * Solo se usa en la ejecución standalone del microfrontend. Renderiza
 * las vistas según el sistema de rutas (`app.routes.ts`).
 */
@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  imports: [RouterOutlet],
})
export class App { }
