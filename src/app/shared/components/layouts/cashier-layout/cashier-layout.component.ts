import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cashier-layout',
  standalone: true,
  imports: [CommonModule, MenubarModule, RouterModule, ButtonModule],
  templateUrl: './cashier-layout.component.html',
  styleUrl: './cashier-layout.component.scss',
})
export class CashierLayoutComponent {
  menuItems: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Vender (POS)',
        icon: 'pi pi-fw pi-th-large',
        routerLink: ['/cashier/pos'],
      },
      {
        label: 'Cierre de Caja',
        icon: 'pi pi-fw pi-calculator',
        routerLink: ['/cashier/cash-closing'],
      },
      {
        label: 'Historial de Cierres',
        icon: 'pi pi-fw pi-history',
        routerLink: ['/cashier/cash-closing-history'],
      },
      {
        label: 'Historial de Pagos',
        icon: 'pi pi-fw pi-dollar',
        routerLink: ['/cashier/payments-history'],
      },
      {
        label: 'Ver Órdenes',
        icon: 'pi pi-fw pi-shopping-cart',
        routerLink: ['/cashier/orders'],
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
