// scanner.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

/* standalone component */
import { ScannerComponent } from './scanner.component';
// Importación correcta del módulo QR
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';

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
    NgxScannerQrcodeComponent, // Usar el módulo correcto
    RouterModule.forChild(routes),

    // Import standalone component
    ScannerComponent
  ]
})
export class ScannerModule {}
