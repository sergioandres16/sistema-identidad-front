import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importamos los componentes standalone del shared module
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';

// Directivas y pipes
import { HighlightDirective } from './directives/highlight.directive';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

/**
 * Módulo utilitario que re-exporta Angular "core modules" y componentes compartidos.
 * Los componentes standalone se importan y exportan, no se declaran.
 */
@NgModule({
  declarations: [
    // Solo declaramos directivas y pipes que no son standalone
    HighlightDirective,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Importamos componentes standalone
    LoadingSpinnerComponent,
    HeaderComponent,
    FooterComponent,
    NotificationPanelComponent
  ],
  exports: [
    // Re-exportamos módulos de Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Exportamos directivas y pipes
    HighlightDirective,
    TimeAgoPipe,

    // Exportamos componentes standalone
    LoadingSpinnerComponent,
    HeaderComponent,
    FooterComponent,
    NotificationPanelComponent
  ]
})
export class SharedModule {}
