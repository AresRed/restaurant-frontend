import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    if (token && this.authService.isTokenExpired(token)) {
      return this.handle401Error(req, next);
    }

    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Limpieza directa si la sesión ya no sirve
          this.authService.forceLogout();
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.accessTokenSubject.next(null);

      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        this.authService.forceLogout();
        return throwError(() => new Error('Sesión inválida o expirada'));
      }

      return this.authService.refreshToken(sessionId).pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          if (res.success && res.data.accessToken) {
            const newToken = res.data.accessToken;
            this.accessTokenSubject.next(newToken);

            const cloned = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`),
            });
            return next.handle(cloned);
          } else {
            this.authService.forceLogout();
            return throwError(() => new Error('No se pudo refrescar el token'));
          }
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.authService.forceLogout();
          return throwError(() => new Error('Refresh inválido'));
        })
      );
    } else {
      return this.accessTokenSubject.pipe(
        filter((t) => t != null),
        take(1),
        switchMap((newToken) => {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${newToken}`),
          });
          return next.handle(cloned);
        })
      );
    }
  }
}
