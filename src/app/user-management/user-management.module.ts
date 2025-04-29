/* src/app/user-management/user-management.module.ts */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

/*  Standalone components  */
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: ':id', component: UserDetailComponent },
  { path: ':id/edit', component: UserEditComponent }
];

@NgModule({
  declarations: [
    // No declarations for standalone components
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),

    // Import the standalone components
    UserListComponent,
    UserDetailComponent,
    UserEditComponent
  ],
  exports: [
    UserEditComponent
  ]
})
export class UserManagementModule {}
