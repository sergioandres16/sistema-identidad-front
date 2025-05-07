// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}/unread`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllNotifications(userId: number, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUnreadCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/count`)
      .pipe(
        catchError(this.handleError)
      );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/user/${userId}/read-all`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  createNotification(userId: number, title: string, message: string, notificationType: string = 'INFO'): Observable<void> {
    let params = new HttpParams()
      .set('title', title)
      .set('message', message)
      .set('notificationType', notificationType);

    return this.http.post<void>(`${this.apiUrl}/user/${userId}`, {}, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}, Mensaje: ${error.error?.message || error.statusText}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
