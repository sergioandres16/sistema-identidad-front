import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../models/card.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  createCard(userId: number): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/user/${userId}`, {});
  }

  getCardById(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${id}`);
  }

  getCardByUserId(userId: number): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/user/${userId}`);
  }

  updateCard(id: number, card: Partial<Card>): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/${id}`, card);
  }

  deactivateCard(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  activateCard(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {});
  }

  renewQrCode(id: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${id}/renew-qr`);
  }

  validateCard(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${id}/validate`);
  }
}
