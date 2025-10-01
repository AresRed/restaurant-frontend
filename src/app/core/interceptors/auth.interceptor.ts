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
  private accessTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

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
          if (!token) {
            this.authService.logout().subscribe();
            return throwError(() => error);
          }

          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.accessTokenSubject.next(null);

            this.isRefreshing = false;
            console.warn('401 recibido, token podría estar expirado');
            return throwError(() => error);
          } else {
            return this.accessTokenSubject.pipe(
              filter((t) => t != null),
              take(1),
              switchMap((newToken) => {
                const cloned = req.clone({
                  headers: req.headers.set(
                    'Authorization',
                    `Bearer ${newToken}`
                  ),
                });
                return next.handle(cloned);
              })
            );
          }
        }

        return throwError(() => error);
      })
    );
  }
}
