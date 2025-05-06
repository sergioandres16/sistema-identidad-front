import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { IdCardComponent } from './id-card/id-card.component';
import { CardStatusComponent } from './card-status/card-status.component';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';

const routes: Routes = [
  { path: '', component: IdCardComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),

    IdCardComponent,
    CardStatusComponent,
    QrGeneratorComponent
  ],
  exports: [
    IdCardComponent,
    CardStatusComponent,
    QrGeneratorComponent
  ]
})
export class CardManagementModule {}
