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
  map,
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
          // Si no hay accessToken, cerramos sesión
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            this.authService.logout().subscribe();
            return throwError(() => error);
          }

          // Solo refrescamos token si no estamos ya refrescando
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.accessTokenSubject.next(null);

            // TODO: Aquí podrías implementar refresh por sessionId
            // Si no quieres refresh, simplemente cerramos sesión
            this.isRefreshing = false;
            this.authService.logout().subscribe();
            return throwError(() => error);
          } else {
            // Esperamos a que termine otro refresh si ya estaba en curso
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
