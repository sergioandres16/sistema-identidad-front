import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

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

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenExpirationTimer: any;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  /* ------------------------------------------------------------------ */
  /* LOGIN                                                               */
  /* ------------------------------------------------------------------ */
  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { username, password };

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap((response) => {
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

  /* ------------------------------------------------------------------ */
  /* REGISTER (con manejo de errores detallado)                          */
  /* ------------------------------------------------------------------ */
  register(registerData: RegisterRequest): Observable<any> {
    console.log('Datos de registro a enviar:', registerData);

    return this.http.post(`${this.apiUrl}/register`, registerData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' // Cambia esto para manejar respuestas en texto plano
    }).pipe(
      tap(response => {
        console.log('Respuesta exitosa:', response);
      }),
      catchError(error => {
        console.error('Error en el servicio de registro:', error);

        // Si es un error de análisis (parsing)
        if (error.name === 'HttpErrorResponse' && error.error instanceof Error) {
          return throwError(() => new Error('Error de comunicación con el servidor. Verifica tu conexión.'));
        }

        let errorMessage = 'Error desconocido al registrarse';

        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Datos de registro inválidos';
        } else if (error.status === 409) {
          errorMessage = 'El correo electrónico o nombre de usuario ya está en uso';
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /* ------------------------------------------------------------------ */
  /* SESIÓN Y TOKEN                                                      */
  /* ------------------------------------------------------------------ */
  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      const {
        id,
        username,
        firstName,
        lastName,
        email,
        role,
        token,
        _tokenExpirationDate,
      } = parsedUser;

      const loadedUser: User = {
        id,
        username,
        firstName,
        lastName,
        email,
        role,
        token,
      };

      if (loadedUser.token) {
        const expirationDate = new Date(_tokenExpirationDate);

        if (expirationDate > new Date()) {
          this.currentUserSubject.next(loadedUser);
          const expirationDuration =
            expirationDate.getTime() - new Date().getTime();
          this.autoLogout(expirationDuration);
        } else {
          this.logout();
        }
      }
    } catch (e) {
      console.error('Error parsing user data', e);
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

  /* ------------------------------------------------------------------ */
  /* GETTERS COMUNES                                                     */
  /* ------------------------------------------------------------------ */
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get token(): string {
    return this.currentUserSubject.value?.token || '';
  }

  get userId(): number {
    return this.currentUserSubject.value?.id || 0;
  }

  get userRole(): string {
    return this.currentUserSubject.value?.role || '';
  }

  isAdmin(): boolean {
    return this.userRole === 'ROLE_ADMIN';
  }

  isScanner(): boolean {
    return this.userRole === 'ROLE_SCANNER';
  }

  /* ------------------------------------------------------------------ */
  /* UTILIDADES PRIVADAS                                                 */
  /* ------------------------------------------------------------------ */
  private handleAuthentication(
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    token: string
  ) {
    // durará 24 h
    const expirationDate = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    );

    const user = {
      id,
      username,
      firstName,
      lastName,
      email,
      role,
      token,
      _tokenExpirationDate: expirationDate,
    };

    this.currentUserSubject.next(user);
    this.autoLogout(24 * 60 * 60 * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: any) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.message) {
      return throwError(() => new Error(errorMessage));
    }

    errorMessage = errorRes.error.message;
    return throwError(() => new Error(errorMessage));
  }
}
