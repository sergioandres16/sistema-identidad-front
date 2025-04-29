import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'card-management',
    loadChildren: () => import('./card-management/card-management.module').then(m => m.CardManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'scanner',
    loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerModule),
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_SCANNER'] }
  },
  {
    path: 'access-logs',
    loadChildren: () => import('./access-logs/access-logs.module').then(m => m.AccessLogsModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
