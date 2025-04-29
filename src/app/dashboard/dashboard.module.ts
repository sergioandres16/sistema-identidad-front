import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CardManagementModule } from '../card-management/card-management.module';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    // No declarations for standalone components
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CardManagementModule,
    // Import the standalone component
    DashboardComponent
  ]
})
export class DashboardModule { }
