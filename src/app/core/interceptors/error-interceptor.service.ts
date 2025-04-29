import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Token expirado o no autorizado
        console.error('Error 401: Sesión expirada o no autorizado');
        router.navigate(['/auth/login']);
        return throwError(() => new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'));
      }

      if (error.status === 403) {
        console.error('Error 403: Acceso prohibido');
        return throwError(() => new Error('No tienes permiso para acceder a este recurso.'));
      }

      if (error.status === 404) {
        console.error('Error 404: Recurso no encontrado');
        return throwError(() => new Error('El recurso solicitado no existe.'));
      }

      if (error.status === 500) {
        console.error('Error 500: Error interno del servidor');
        return throwError(() => new Error('Ha ocurrido un error en el servidor. Por favor, intenta más tarde.'));
      }

      // Otros errores
      console.error(`Error ${error.status}: ${error.message}`);
      return throwError(() => error);
    })
  );
};
