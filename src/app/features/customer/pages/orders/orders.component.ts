import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { OrderResponse } from '../../../../core/models/order.model';
import { OrderService } from '../../../../core/services/orders/order.service';
import { Router } from '@angular/router';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    TagModule,
    TooltipModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data.map((o) => ({ ...o, date: new Date(o.date) }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando órdenes', err);
        this.loading = false;
      },
    });
  }

  viewOrderDetail(orderId: number) {
    this.router.navigate(['/orders', orderId]);
  }

  getStatusIcon(status: string) {
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'pi pi-clock text-yellow-600';
      case 'CONFIRMADA':
        return 'pi pi-check-circle text-green-600';
      case 'CANCELADA':
        return 'pi pi-times-circle text-red-600';
      case 'FALLIDA':
        return 'pi pi-exclamation-circle text-gray-600';
      case 'EN PROGRESO':
        return 'pi pi-spinner animate-spin text-blue-600';
      case 'LISTA PARA RECOGER':
        return 'pi pi-box text-purple-600';
      case 'COMPLETADA':
        return 'pi pi-check text-green-700';
      default:
        return 'pi pi-info-circle text-gray-600';
    }
  }

  getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'warn';
      case 'CONFIRMADA':
        return 'success';
      case 'CANCELADA':
        return 'danger';
      case 'FALLIDA':
        return 'secondary';
      case 'EN PROGRESO':
        return 'contrast';
      case 'LISTA PARA RECOGER':
        return 'contrast';
      case 'COMPLETADA':
        return 'success';
      default:
        return 'secondary';
    }
  }
}
