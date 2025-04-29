import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

import { ScannerComponent } from './scanner.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: ScannerComponent }
];

@NgModule({
  declarations: [
    ScannerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgxScannerQrcodeModule
  ]
})
export class ScannerModule { }
