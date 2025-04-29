import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}/unread`);
  }

  getAllNotifications(userId: number, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { params });
  }

  getUnreadCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/count`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/user/${userId}/read-all`, {});
  }

  createNotification(userId: number, title: string, message: string, notificationType: string = 'INFO'): Observable<void> {
    let params = new HttpParams()
      .set('title', title)
      .set('message', message)
      .set('notificationType', notificationType);

    return this.http.post<void>(`${this.apiUrl}/user/${userId}`, {}, { params });
  }
}
