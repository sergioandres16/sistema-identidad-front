import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'user-management',
    loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [authGuard]
  },
  {
    path: 'card-management',
    loadChildren: () => import('./card-management/card-management.module').then(m => m.CardManagementModule),
    canActivate: [authGuard]
  },
  {
    path: 'scanner',
    loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule),
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_SCANNER'] }
  },
  {
    path: 'access-logs',
    loadChildren: () => import('./access-logs/access-logs.module').then(m => m.AccessLogsModule),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

export const appRoutes = routes;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
