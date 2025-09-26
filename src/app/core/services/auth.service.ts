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

  loginWithGoogle(): Observable<AuthResponse> {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      'http://localhost:8080/oauth2/authorization/google',
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    return new Observable<AuthResponse>((observer) => {
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== 'http://localhost:8080') return;

        const data = event.data;

        if (data?.success === false) {
          observer.error(
            new Error(data.message || 'Error en login con Google')
          );
          popup?.close();
          window.removeEventListener('message', messageHandler);
          return;
        }

        if (data?.accessToken) {
          observer.next({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || '',
          });
          observer.complete();
          popup?.close();
          window.removeEventListener('message', messageHandler);
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
