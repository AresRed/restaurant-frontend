import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { NotificationKitchenComponent } from '../notification-kitchen/notification-kitchen.component';

@Component({
  selector: 'app-chef-layout',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    RouterModule,
    ButtonModule,
    DrawerModule,
    NotificationKitchenComponent,
  ],
  templateUrl: './chef-layout.component.html',
  styleUrl: './chef-layout.component.scss',
})
export class ChefLayoutComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isNotificationsDrawerVisible = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Órdenes de Cocina',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/chef/orders'],
      },
      {
        label: 'Inventario',
        icon: 'pi pi-fw pi-box',
        routerLink: ['/chef/inventory'],
      },
      {
        label: 'Notificaciones',
        icon: 'pi pi-fw pi-bell',
        command: () => (this.isNotificationsDrawerVisible = true),
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
