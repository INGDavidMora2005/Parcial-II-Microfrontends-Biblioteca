import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

/**
 * Definición de las rutas del Host de la Biblioteca.
 * Utiliza carga perezosa (lazy loading) de componentes remotos a través de Module Federation.
 *
 * @remarks
 * Cada ruta apunta a un remoteEntry.js específico y carga un componente expuesto por el microfrontend.
 * @see {@link https://www.angular-architects.io/module-federation/}
 */
export const routes: Routes = [
  {
    path: 'books',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './BooksPage',
      }).then((m) => m.BooksPage),
  },
  {
    path: 'members',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './MembersPage',
      }).then((m) => m.MembersPage),
  },
  {
    path: 'loans',
    loadComponent: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './LoansPage',
      }).then((m) => m.LoansPage),
  },
  {
    path: '**',
    redirectTo: 'books',
    pathMatch: 'full',
  },
];
