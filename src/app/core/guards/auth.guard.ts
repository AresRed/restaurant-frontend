import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { UserResponse } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { RoleRedirectService } from '../services/role-redirect/role-redirect.service';
import { UiService } from '../services/ui.service';

interface RouteData {
  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private uiService: UiService,
    private roleRedirectService: RoleRedirectService,
    private notificationService: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const allowedRoles: string[] = (route.data as RouteData).roles || [];

    return this.authService.currentUser$.pipe(
      take(1),
      map((user: UserResponse | null) => {
        if (!user) {
          this.uiService.openLogin();
          return this.router.createUrlTree(['/home']);
        }

        if (allowedRoles.length === 0) {
          return true;
        }

        const hasRole = user.roles.some((role) => allowedRoles.includes(role));

        if (hasRole) {
          return true;
        }

        const userDashboardUrl = this.roleRedirectService.getRedirectUrlByRole(
          user.roles
        );
        this.notificationService.warn(
          'Acceso Denegado',
          'No tienes permiso para ver esta página.'
        );
        return this.router.createUrlTree([userDashboardUrl]);
      })
    );
  }
}
