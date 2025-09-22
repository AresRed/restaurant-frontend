import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';
  private usersUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/login`,
      data,
      { withCredentials: true }
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
    if (refreshToken) {
      return this.http.post<ApiResponse<Object>>(
        `${this.baseUrl}/logout`,
        { refreshToken },
        { withCredentials: true }
      );
    } else {
      // Logout de cookie HttpOnly (Google login)
      return this.http.post<ApiResponse<Object>>(
        `${this.baseUrl}/logout`,
        {},
        { withCredentials: true }
      );
    }
  }

  getCurrentUser(): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('accessToken');
    return this.http.get<ApiResponse<any>>(`${this.usersUrl}/me`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
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
        // aceptar solo mensajes de tu backend
        if (event.origin !== 'http://localhost:8080') return;

        const data = event.data;

        if (data?.success === false) {
          // ❌ error enviado desde FailureHandler
          observer.error(
            new Error(data.message || 'Error en login con Google')
          );
          popup?.close();
          window.removeEventListener('message', messageHandler);
          return;
        }

        if (data?.accessToken) {
          // ✅ éxito
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

  getUserInfo() {
    var data = this.http.get('http://localhost:8080/loginSuccess', {
      withCredentials: true,
    });
    console.log(data);
    return data;
  }
}
