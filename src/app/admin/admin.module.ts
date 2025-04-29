/* admin.module.ts */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { UserManagementModule } from '../user-management/user-management.module';

/* 👉 faltaban estos dos imports 👇 */
import { UserListComponent } from '../user-management/user-list/user-list.component';
import { UserEditComponent } from '../user-management/user-edit/user-edit.component';

const routes: Routes = [
  { path: 'users',       component: UserListComponent },
  { path: 'users/:id',   component: UserEditComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];

@NgModule({
  /* sin declarations */
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    UserListComponent,
    UserEditComponent
  ]
})
export class AdminModule {}
