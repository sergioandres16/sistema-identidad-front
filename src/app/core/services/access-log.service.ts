import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessLog } from '../models/access-log.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  private apiUrl = `${environment.apiUrl}/access-logs`;

  constructor(private http: HttpClient) {}

  validateQrCode(qrToken: string, zoneId: number, scannerId: string, scannerLocation: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate-qr`, {
      qrToken,
      zoneId,
      scannerId,
      scannerLocation
    });
  }

  changeUserStatusOnAccess(userId: number, zoneId: number, newStatusId: number): Observable<AccessLog> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('zoneId', zoneId.toString())
      .set('newStatusId', newStatusId.toString());

    return this.http.post<AccessLog>(`${this.apiUrl}/change-status`, {}, { params });
  }

  getUserAccessHistory(userId: number, limit: number = 20): Observable<AccessLog[]> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<AccessLog[]>(`${this.apiUrl}/user/${userId}`, { params });
  }

  getLatestUserAccess(userId: number): Observable<AccessLog> {
    return this.http.get<AccessLog>(`${this.apiUrl}/user/${userId}/latest`);
  }

  getAccessLogsByDateRange(startDate: Date, endDate: Date): Observable<AccessLog[]> {
    let params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<AccessLog[]>(`${this.apiUrl}/date-range`, { params });
  }
}
