import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { SharedModule }        from '../shared/shared.module';

/* stand-alone ↓ */
import { IdCardComponent     } from './id-card/id-card.component';

const routes: Routes = [
  { path: '', component: IdCardComponent }   // ejemplo: vista raíz
];

@NgModule({
  declarations: [],              //  ←  NADA
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    IdCardComponent              //  👈 se **importa**, no se declara
  ]
})
export class CardManagementModule {}
