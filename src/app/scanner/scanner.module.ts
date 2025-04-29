import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule }        from '../shared/shared.module';

/* stand-alone ↓ */
import { ScannerComponent } from './scanner.component';

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

    ScannerComponent
  ]
})
export class ScannerModule {}
