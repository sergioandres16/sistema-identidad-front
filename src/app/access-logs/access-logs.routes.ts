import { Routes } from '@angular/router';
import { LogListComponent } from './log-list/log-list.component';
import { LogDetailComponent } from './log-detail/log-detail.component';

export const ACCESS_LOGS_ROUTES: Routes = [
  { path: '', component: LogListComponent },
  { path: ':id', component: LogDetailComponent }
];
