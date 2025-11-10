import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationOrdersComponent } from '../notification-orders/notification-orders.component';

@Component({
  selector: 'app-waiter-layout',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    RouterModule,
    DrawerModule,
    ButtonModule,
    NotificationOrdersComponent,
  ],
  templateUrl: './waiter-layout.component.html',
  styleUrls: ['./waiter-layout.component.scss'],
})
export class WaiterLayoutComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isNotificationsDrawerVisible: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Mesas',
        icon: 'pi pi-fw pi-table',
        routerLink: ['/waiter/tables'],
      },
      {
        label: 'Tomar Orden (POS)',
        icon: 'pi pi-fw pi-pencil',
        routerLink: ['/waiter/pos'],
      },
      {
        label: 'Historial de Órdenes',
        icon: 'pi pi-fw pi-history',
        routerLink: ['/waiter/historyOrders'],
      },
      {
        label: 'Notificaciones',
        icon: 'pi pi-fw pi-bell',
        command: () => this.showNotifications(),
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  /**
   * Muestra el panel lateral de notificaciones.
   */
  showNotifications(): void {
    this.isNotificationsDrawerVisible = true;
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): void {
    this.authService.logout().subscribe();
  }
}
