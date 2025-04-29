import { Routes } from '@angular/router';
import { IdCardComponent } from './id-card/id-card.component';

export const CARD_MANAGEMENT_ROUTES: Routes = [
  { path: 'id-card', component: IdCardComponent },
  { path: '', redirectTo: 'id-card', pathMatch: 'full' }
];
