import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RoleRedirectService {
  constructor(private router: Router) {}

  /**
   * Redirige al usuario a su dashboard principal basado en su rol.
   * La prioridad es de Admin > Chef > Mesero > Cajero > Cliente.
   */
  redirectUserBasedOnRole(user: UserResponse | null): void {
    const url = this.getRedirectUrlForUser(user);
    this.router.navigate([url]);
  }

  /**
   * Obtiene la URL del dashboard principal para un usuario.
   */
  getRedirectUrlForUser(user: UserResponse | null): string {
    if (!user) {
      return '/home';
    }
    return this.getRedirectUrlByRole(user.roles);
  }

  /**
   * Devuelve la ruta raíz para un conjunto de roles.
   */
  getRedirectUrlByRole(roles: string[]): string {
    if (roles.includes('ROLE_ADMIN')) {
      return '/admin';
    }
    if (roles.includes('ROLE_MANAGER')) {
      return '/admin';
    }
    if (roles.includes('ROLE_CHEF')) {
      return '/chef';
    }
    if (roles.includes('ROLE_WAITER')) {
      return '/waiter';
    }
    if (roles.includes('ROLE_CASHIER')) {
      return '/cashier';
    }
    if (roles.includes('ROLE_CLIENT')) {
      return '/home';
    }

    return '/home';
  }
}
