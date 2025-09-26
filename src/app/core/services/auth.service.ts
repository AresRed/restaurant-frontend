import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { RegisterRequest } from '../models/auth/register/register.model';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private usersUrl = 'http://localhost:8080/api/v1/users';

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(
    data: LoginRequest
  ): Observable<ApiResponse<AuthResponse & { user: any }>> {
    return this.http
      .post<ApiResponse<AuthResponse & { user: any }>>(
        `${this.baseUrl}/login`,
        data
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);

            this.currentUserSubject.next(res.data.user);
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<Object>> {
    return this.http.post<ApiResponse<Object>>(
      `${this.baseUrl}/register`,
      data,
      { withCredentials: true }
    );
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/refresh`,
      { refreshToken },
      { withCredentials: true }
    );
  }

  logout(refreshToken?: string): Observable<ApiResponse<Object>> {
    return this.http
      .post<ApiResponse<Object>>(
        `${this.baseUrl}/logout`,
        { refreshToken },
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        })
      );
  }

  loginWithGoogle(): Observable<any> {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      'http://localhost:8080/oauth2/authorization/google',
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    return new Observable<any>((observer) => {
      if (!popup) {
        observer.error(new Error('No se pudo abrir el popup de Google'));
        return;
      }

      const cleanup = () => {
        window.removeEventListener('message', messageHandler);
      };

      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== 'http://localhost:8080') return;

        const data = event.data;
        console.log('Mensaje recibido desde Google OAuth:', data); // TODO: Eliminar en prod

        if (data?.success === false) {
          observer.error(new Error(data.message || 'Error en Google OAuth'));
          popup.close();
          cleanup();
          return;
        }

        if (data?.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          if (data.refreshToken)
            localStorage.setItem('refreshToken', data.refreshToken);

          this.getCurrentUser().subscribe({
            next: (userRes) => {
              if (userRes.success && userRes.data) {
                localStorage.setItem(
                  'currentUser',
                  JSON.stringify(userRes.data)
                );
                this.currentUserSubject.next(userRes.data);
                observer.next(userRes.data);
                observer.complete();
              } else {
                observer.error(
                  new Error('No se pudo obtener la información del usuario')
                );
              }
              popup.close();
              cleanup();
            },
            error: (err) => {
              observer.error(err);
              popup.close();
              cleanup();
            },
          });
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  getCurrentUser(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.usersUrl}/me`);
  }

  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }
}
