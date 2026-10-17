import { Routes } from '@angular/router';

/**
 * Definición de las rutas de la aplicación en ejecución standalone.
 *
 * @remarks
 * Solo se usa cuando el microfrontend corre solo en `http://localhost:4203`.
 * Dentro del host, la ruta `/loans` del host carga `LoansPage` por Module Federation.
 *
 * @see {@link LoansPage}
 */
export const routes: Routes = [
  /**
   * Ruta de préstamos.
   *
   * @remarks
   * Renderiza el componente `LoansPage`, encargado de listar,
   * mostrar el detalle y registrar préstamos.
   */
  { path: '', loadComponent: () => import('./presentation/pages/loans/loans.page').then((m) => m.LoansPage) },
];
