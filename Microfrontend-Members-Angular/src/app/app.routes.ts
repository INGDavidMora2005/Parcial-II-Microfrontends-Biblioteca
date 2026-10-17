import { Routes } from '@angular/router';

import { MembersPage } from './presentation/pages/members/members.page';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./presentation/pages/members/members.page').then(m => m.MembersPage) },
];
