import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { environment } from '../../../../../../environments/environment';
import { OrderStatusResponse } from '../../../../../core/models/order/order-statuses/order-statuses.model';
import { OrderResponse } from '../../../../../core/models/order/orderhttp/order.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { OrderStatusService } from '../../../../../core/services/orders/order-status.service';
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
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  orderId!: number;
  order!: OrderResponse;
  orderStatuses!: OrderStatusResponse[];
  loading = true;
  googleMapsApiKey = environment.googleMapsApiKey;

  timelineSteps: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private orderStatusService: OrderStatusService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.loadOrderStatuses();
    this.loadOrder();
  }

  loadOrderStatuses() {
    this.orderStatusService.getAllOrderStatuses().subscribe({
      next: (res) => {
        if (res.success) {
          this.orderStatuses = res.data;
        }
      },
      error: (err) => {
        this.notificationService.error('Error', err.message);
      },
    });
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
    this.router.navigate(['/profile/orders']);
  }

  getStepStatus(
    orderStatus: string,
    step: string
  ): 'completed' | 'current' | 'upcoming' {
    const orderIndex = this.timelineSteps.findIndex(
      (s) => s.toLowerCase() === orderStatus.toLowerCase()
    );
    const stepIndex = this.timelineSteps.indexOf(step);
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  }

  getStepIcon(step: string): string {
    switch (step) {
      case 'Pendiente':
        return 'pi pi-clock';
      case 'Confirmada':
        return 'pi pi-check';
      case 'En Progreso':
        return 'pi pi-spin pi-spinner';
      case 'Completada':
        return 'pi pi-flag-fill';
      default:
        return 'pi pi-circle';
    }
  }

  getStatusColor(status?: string) {
    if (!status) return 'secondary';
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
        return 'warn';
      case 'CONFIRMADA':
      case 'COMPLETADA':
        return 'success';
      case 'CANCELADA':
        return 'danger';
      case 'EN PROGRESO':
      case 'LISTA PARA RECOGER':
        return 'info';
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
      case 'COMPLETADA':
        return 'pi pi-check-circle text-green-600';
      case 'CANCELADA':
        return 'pi pi-times-circle text-red-600';
      case 'EN PROGRESO':
      case 'LISTA PARA RECOGER':
        return 'pi pi-spin pi-spinner text-blue-600';
      default:
        return 'pi pi-info-circle text-gray-600';
    }
  }

  calculateProgress(estimatedTime: number): number {
    const maxTime = 60;
    return Math.min((estimatedTime / maxTime) * 100, 100);
  }

  calculateTimelineProgress(orderStatus: string): number {
    const currentIndex = this.timelineSteps.findIndex(
      (s) => s.toLowerCase() === orderStatus.toLowerCase()
    );
    if (currentIndex === -1) return 0;

    const totalSteps = this.timelineSteps.length - 1;
    return (currentIndex / totalSteps) * 100;
  }
}
