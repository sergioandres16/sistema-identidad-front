// scanner.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScannerComponent } from './scanner.component';

// Importa correctamente el SharedModule con la ruta relativa
import { SharedModule } from '../shared/shared.module';

// No importes NgxScannerQrcodeModule - no existe en la versión 1.7.6

const routes: Routes = [
  { path: '', component: ScannerComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),

    // Import the standalone component
    ScannerComponent
  ]
})
export class ScannerModule {}
