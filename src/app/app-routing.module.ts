import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // dashboard
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },

  // auth (login / register)
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },

  // user-management
  {
    path: 'user-management',
    loadChildren: () =>
      import('./user-management/user-management.module').then(
        m => m.UserManagementModule
      ),
    canActivate: [authGuard]
  },

  // card-management
  {
    path: 'card-management',
    loadChildren: () =>
      import('./card-management/card-management.module').then(
        m => m.CardManagementModule
      ),
    canActivate: [authGuard]
  },

  // scanner (con restricción por roles; tu authGuard ya lee route.data.roles)
  {
    path: 'scanner',
    loadChildren: () =>
      import('./scanner/scanner.module').then(m => m.ScannerModule),
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_SCANNER'] }
  },

  // access-logs
  {
    path: 'access-logs',
    loadChildren: () =>
      import('./access-logs/access-logs.module').then(
        m => m.AccessLogsModule
      ),
    canActivate: [authGuard]
  },

  // wildcard
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
