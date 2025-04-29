import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IdCardComponent } from './id-card/id-card.component';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';
import { CardStatusComponent } from './card-status/card-status.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: 'id-card', component: IdCardComponent }
];

@NgModule({
  declarations: [
    IdCardComponent,
    QrGeneratorComponent,
    CardStatusComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    IdCardComponent,
    QrGeneratorComponent,
    CardStatusComponent
  ]
})
export class CardManagementModule { }
