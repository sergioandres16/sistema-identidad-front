import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule }       from '@angular/router';

/**
 * Módulo utilitario que únicamente re-exporta Angular “core modules”.
 * ¡No declares aquí componentes/pipe/directivas stand-alone!
 */
@NgModule({
  declarations: [],           //  ←  vacías
  imports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports:      [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule {}
