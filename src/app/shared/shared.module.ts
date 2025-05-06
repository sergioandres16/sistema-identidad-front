import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';

import { HighlightDirective } from './directives/highlight.directive';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent,
    HeaderComponent,
    FooterComponent,
    NotificationPanelComponent,
    HighlightDirective,
    TimeAgoPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent,
    HeaderComponent,
    FooterComponent,
    NotificationPanelComponent,
    HighlightDirective,
    TimeAgoPipe
  ]
})
export class SharedModule {}
