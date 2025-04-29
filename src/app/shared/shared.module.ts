// shared.module.ts modificado
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importamos los componentes standalone
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';

// Directivas y pipes ahora son standalone también
import { HighlightDirective } from './directives/highlight.directive';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [], // No declarations, todo es standalone
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Importamos los componentes standalone
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
    // Exportamos componentes standalone
    LoadingSpinnerComponent,
    HeaderComponent,
    FooterComponent,
    NotificationPanelComponent,
    HighlightDirective,
    TimeAgoPipe
  ]
})
export class SharedModule {}
