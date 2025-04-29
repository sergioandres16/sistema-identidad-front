import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.router.navigate(['/auth/login']);
            return throwError(() => new Error('Tu sesión ha expirado.'));
          case 403:
            return throwError(() => new Error('Acceso prohibido'));
          case 404:
            return throwError(() => new Error('Recurso no encontrado'));
          case 500:
            return throwError(() => new Error('Error interno del servidor'));
          default:
            return throwError(() => error);
        }
      })
    );
  }
}
