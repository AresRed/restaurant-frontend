import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            this.authService.logout().subscribe();
            return throwError(() => error);
          }

          return this.authService.refreshToken(refreshToken).pipe(
            map((res) => res.data.accessToken),
            switchMap((newToken: string) => {
              const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`),
              });
              return next.handle(cloned);
            }),
            catchError((err) => {
              this.authService.logout().subscribe();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
