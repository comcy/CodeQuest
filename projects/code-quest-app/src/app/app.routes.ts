import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('users-lib').then(m => m.UserListComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('users-lib').then(m => m.UserDetailComponent),
  },
];
