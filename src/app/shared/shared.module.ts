import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HighlightDirective } from './directives/highlight.directive';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotificationPanelComponent,
    LoadingSpinnerComponent,
    HighlightDirective,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    NotificationPanelComponent,
    LoadingSpinnerComponent,
    HighlightDirective,
    TimeAgoPipe
  ]
})
export class SharedModule { }
