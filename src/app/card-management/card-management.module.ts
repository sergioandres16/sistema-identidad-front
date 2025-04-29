import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

/* standalone components */
import { IdCardComponent } from './id-card/id-card.component';
import { CardStatusComponent } from './card-status/card-status.component';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';

const routes: Routes = [
  { path: '', component: IdCardComponent }   // vista raíz
];

@NgModule({
  declarations: [],  // Vacío porque todos los componentes son standalone
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),

    // Importamos los componentes standalone
    IdCardComponent,
    CardStatusComponent,
    QrGeneratorComponent
  ],
  exports: [
    // Exportamos los componentes para que estén disponibles en otros módulos
    IdCardComponent,
    CardStatusComponent,
    QrGeneratorComponent
  ]
})
export class CardManagementModule {}
