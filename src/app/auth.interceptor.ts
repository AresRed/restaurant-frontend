
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const router = inject(Router);
  const authService = inject(AuthService);


  const authToken = authService.getAccessToken();
  let authReq = req;

  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  // 2. Enviar y capturar errores de la respuesta del servidor
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        console.error('Redirección 401: Usuario no autorizado o sesión expirada.');
        // Limpiar sesión y redirigir
        router.navigate(['/login']); // Redirige a la página de login
      }

      return throwError(() => error); 
    })
  );
};


