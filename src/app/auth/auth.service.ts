import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  membershipType?: string;
  studentCode?: string;
  faculty?: string;
}

interface LoginResponse {
  token: string;
  tokenType: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenExpirationTimer: any;

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          this.handleAuthentication(
            response.id,
            response.username,
            response.firstName,
            response.lastName,
            response.email,
            response.role,
            response.token
          );
        }),
        catchError(this.handleError)
      );
  }

  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData)
      .pipe(catchError(this.handleError));
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const { id, username, firstName, lastName, email, role, _token, _tokenExpirationDate } = userData;
    const loadedUser = {
      id,
      username,
      firstName,
      lastName,
      email,
      role,
      token: _token
    };

    if (loadedUser.token) {
      const expirationDate = new Date(_tokenExpirationDate);
      this.currentUserSubject.next(loadedUser);

      const expirationDuration = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth/login']);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get token(): string {
    return this.currentUserSubject.value?.token;
  }

  get userId(): number {
    return this.currentUserSubject.value?.id;
  }

  get userRole(): string {
    return this.currentUserSubject.value?.role;
  }

  isAdmin(): boolean {
    return this.userRole === 'ROLE_ADMIN';
  }

  isScanner(): boolean {
    return this.userRole === 'ROLE_SCANNER';
  }

  private handleAuthentication(
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    token: string
  ) {
    // JWT typically expires in 24 hours
    const expirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    const user = {
      id,
      username,
      firstName,
      lastName,
      email,
      role,
      token,
      _tokenExpirationDate: expirationDate
    };

    this.currentUserSubject.next(user);
    this.autoLogout(24 * 60 * 60 * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: any) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }

    errorMessage = errorRes.error.message;
    return throwError(errorMessage);
  }
}
