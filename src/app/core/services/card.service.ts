// src/app/core/services/card.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Card } from '../models/card.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  createCard(userId: number): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/user/${userId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  getCardById(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCardByUserId(userId: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/user/${userId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCard(id: number, card: Partial<Card>): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card)
      .pipe(
        catchError(this.handleError)
      );
  }

  deactivateCard(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  activateCard(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  renewQrCode(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${id}/renew-qr`, { responseType: 'text' })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  validateCard(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/validate`)
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
