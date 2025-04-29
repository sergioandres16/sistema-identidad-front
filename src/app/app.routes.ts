import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'card-management',
    loadChildren: () => import('./card-management/card-management.routes').then(m => m.CARD_MANAGEMENT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'scanner',
    loadComponent: () => import('./scanner/scanner.component').then(c => c.ScannerComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_SCANNER'] }
  },
  {
    path: 'access-logs',
    loadChildren: () => import('./access-logs/access-logs.routes').then(m => m.ACCESS_LOGS_ROUTES),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
