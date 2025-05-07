// src/app/core/services/access-log.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccessLog } from '../models/access-log.model';
import { QrValidationRequest, QrValidationResponse } from '../models/qr-validation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  private apiUrl = `${environment.apiUrl}/access-logs`;

  constructor(private http: HttpClient) {}

  validateQrCode(
    qrToken: string,
    zoneId: number,
    scannerId: string,
    scannerLocation: string
  ): Observable<QrValidationResponse> {
    const request: QrValidationRequest = {
      qrToken,
      zoneId,
      scannerId,
      scannerLocation
    };

    return this.http.post<QrValidationResponse>(`${this.apiUrl}/validate-qr`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  changeUserStatusOnAccess(
    userId: number,
    zoneId: number,
    newStatusId: number
  ): Observable<AccessLog> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('zoneId', zoneId.toString())
      .set('newStatusId', newStatusId.toString());

    return this.http.post<AccessLog>(`${this.apiUrl}/change-status`, {}, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserAccessHistory(userId: number, limit: number = 20): Observable<AccessLog[]> {
    let params = new HttpParams()
      .set('limit', limit.toString());

    return this.http.get<AccessLog[]>(`${this.apiUrl}/user/${userId}`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLatestUserAccess(userId: number): Observable<AccessLog> {
    return this.http.get<AccessLog>(`${this.apiUrl}/user/${userId}/latest`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAccessLogsByDateRange(startDate: Date, endDate: Date): Observable<AccessLog[]> {
    let params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<AccessLog[]>(`${this.apiUrl}/date-range`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Esta función sería ideal, pero no existe un endpoint específico para esto en el backend
  getLogById(id: number): Observable<AccessLog> {
    // Esta es una implementación simulada, ya que no existe el endpoint directamente
    // En un caso real, podríamos implementarlo o extender el backend
    return this.http.get<AccessLog>(`${this.apiUrl}/${id}`)
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
