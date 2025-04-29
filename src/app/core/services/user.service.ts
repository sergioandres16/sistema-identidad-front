import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getPaginatedUsers(page: number, size: number, sortBy: string = 'id'): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<any>(`${this.apiUrl}/paginated`, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changeUserStatus(userId: number, statusId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${userId}/status/${statusId}`, {});
  }

  assignRole(userId: number, roleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/roles/${roleName}`, {});
  }

  removeRole(userId: number, roleName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/roles/${roleName}`);
  }
}
