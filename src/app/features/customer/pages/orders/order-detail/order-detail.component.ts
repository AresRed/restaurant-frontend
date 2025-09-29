import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { OrderResponse } from '../../../../../core/models/order.model';
import { OrderService } from '../../../../../core/services/orders/order.service';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    TagModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  orderId!: number;
  order!: OrderResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        this.order = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando orden', err);
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/orders']);
  }

  getStatusColor(status?: string) {
    if (!status) return 'secondary';
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

  getStatusIcon(status?: string) {
    if (!status) return 'pi pi-info-circle text-gray-600';
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'pi pi-clock text-yellow-600';
      case 'CONFIRMADA':
        return 'pi pi-check-circle text-green-600';
      case 'CANCELADA':
        return 'pi pi-times-circle text-red-600';
      default:
        return 'pi pi-info-circle text-gray-600';
    }
  }
}
