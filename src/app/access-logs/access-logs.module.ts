import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { SharedModule }        from '../shared/shared.module';

/* stand-alone ↓ */
import { LogListComponent   } from './log-list/log-list.component';
import { LogDetailComponent } from './log-detail/log-detail.component';

const routes: Routes = [
  { path: '',        component: LogListComponent },
  { path: ':id',     component: LogDetailComponent }
];

@NgModule({
  declarations: [],          //  ←  vacío
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),

    LogListComponent,
    LogDetailComponent
  ]
})
export class AccessLogsModule {}
