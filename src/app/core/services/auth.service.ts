import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  UserLoginResponse,
} from '../models/auth/login/login.model';
import { RegisterRequest } from '../models/auth/register/register.model';
import { ApiResponse } from '../models/base/api-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(data: LoginRequest): Observable<ApiResponse<UserLoginResponse>> {
    return this.http
      .post<ApiResponse<UserLoginResponse>>(
        `${environment.apiUrl}/api/v1/auth/login`,
        data
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data.accessToken) {
            const exp = this.getTokenExpiration(res.data.accessToken);

            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('expiresAt', exp.toString());
            localStorage.setItem('currentUser', JSON.stringify(res.data.user));

            this.currentUserSubject.next(res.data.user);
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<Object>> {
    return this.http.post<ApiResponse<Object>>(
      `${environment.apiUrl}/api/v1/auh/register`,
      data,
      { withCredentials: true }
    );
  }

  refreshToken(
    refreshToken: string
  ): Observable<ApiResponse<UserLoginResponse>> {
    return this.http
      .post<ApiResponse<UserLoginResponse>>(
        `${environment.apiUrl}/api/v1/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data.accessToken) {
            const exp = this.getTokenExpiration(res.data.accessToken);

            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('expiresAt', exp.toString());

            if (res.data.user) {
              localStorage.setItem(
                'currentUser',
                JSON.stringify(res.data.user)
              );
              this.currentUserSubject.next(res.data.user);
            }
          }
        })
      );
  }

  logout(refreshToken?: string): Observable<ApiResponse<Object>> {
    return this.http
      .post<ApiResponse<Object>>(
        `${environment.apiUrl}/api/v1/auth/logout`,
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
        if (event.origin !== environment.apiUrl) return;

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

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http
      .get<ApiResponse<User>>(`${environment.apiUrl}/api/v1/users/me`)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            localStorage.setItem('currentUser', JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  private getTokenExpiration(token: string): number {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
      throw new Error('El token no contiene fecha de expiración');
    }
    return decoded.exp * 1000;
  }

  isTokenExpired(token: string): boolean {
    const exp = this.getTokenExpiration(token);
    return Date.now() > exp;
  }
}
