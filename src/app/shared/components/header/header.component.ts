import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UiService } from '../../../core/services/ui.service';
import { LoginDrawerComponent } from '../../../features/auth/components/login-drawer/login-drawer.component';
import { CartDrawerComponent } from '../../../features/customer/components/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginDrawerComponent,
    AvatarModule,
    MenuModule,
    CartDrawerComponent,
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  currentUser$!: Observable<any | null>;
  itemsUserMenu: MenuItem[] | undefined;

  constructor(
    public uiService: UiService,
    private authService: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;

    this.itemsUserMenu = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      {
        label: 'Mis compras',
        icon: 'pi pi-shopping-cart',
        command: () => this.goToOrders(),
      },
      {
        label: 'Mis Reservas',
        icon: 'pi pi-calendar',
        command: () => this.goToReservations(),
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openLogin() {
    this.uiService.openLogin();
  }

  openSignup() {
    this.uiService.openSignup();
  }

  openCart() {
    console.log('Prueba');
    this.uiService.openCart();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.notify.success(
          'Sesión cerrada',
          'Has cerrado sesión correctamente'
        );
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.notify.error('Error', 'No se pudo cerrar la sesión');
      },
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goToReservations() {
    this.router.navigate(['/my-reservations']);
  }
}
