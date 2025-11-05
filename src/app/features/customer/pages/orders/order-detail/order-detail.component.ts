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
import {
  OrderResponse,
  OrderStatusStepResponse,
} from '../../../../../core/models/order/orderhttp/order.model';
import { NotificationService } from '../../../../../core/services/notification.service';
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
  loading = true;
  googleMapsApiKey = environment.googleMapsApiKey;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private notificationService: NotificationService,
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
        this.notificationService.error('Error', 'No se pudo cargar la orden.');
      },
    });
  }

  goBack() {
    this.router.navigate(['/profile/orders']);
  }

  getStepStatus(
    orderStatus: string,
    stepName: string,
    timeline: OrderStatusStepResponse[]
  ): 'completed' | 'current' | 'upcoming' {
    const orderIndex = timeline.findIndex(
      (s) => s.name.toLowerCase() === orderStatus.toLowerCase()
    );

    const stepIndex = timeline.findIndex(
      (s) => s.name.toLowerCase() === stepName.toLowerCase()
    );

    if (orderIndex === -1) {
      if (
        stepIndex === 0 &&
        (orderStatus.toUpperCase() === 'CANCELADO' ||
          orderStatus.toUpperCase() === 'FALLIDO')
      ) {
        return 'current';
      }
      return 'upcoming';
    }

    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  }

  getStepIcon(stepName: string): string {
    switch (stepName.toLowerCase()) {
      case 'pendiente de confirmación':
        return 'pi pi-question-circle';
      case 'pendiente':
        return 'pi pi-clock';
      case 'confirmado':
        return 'pi pi-check';
      case 'en proceso':
        return 'pi pi-spin pi-spinner';
      case 'en camino':
        return 'pi pi-truck';
      case 'listo para recoger':
        return 'pi pi-shopping-bag';
      case 'entregado':
      case 'completado':
        return 'pi pi-flag-fill';
      default:
        return 'pi pi-circle';
    }
  }

  getStatusColor(status?: string) {
    if (!status) return 'secondary';
    switch (status.toUpperCase()) {
      case 'PENDIENTE':
      case 'PENDIENTE DE CONFIRMACIÓN':
        return 'warn';
      case 'CONFIRMADO':
      case 'COMPLETADO':
      case 'ENTREGADO':
        return 'success';
      case 'CANCELADO':
      case 'FALLIDO':
        return 'danger';
      case 'EN PROCESO':
      case 'LISTO PARA RECOGER':
      case 'EN CAMINO':
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
      case 'PENDIENTE DE CONFIRMACIÓN':
        return 'pi pi-question-circle text-yellow-600';
      case 'CONFIRMADO':
      case 'COMPLETADO':
      case 'ENTREGADO':
        return 'pi pi-check-circle text-green-600';
      case 'CANCELADO':
      case 'FALLIDO':
        return 'pi pi-times-circle text-red-600';
      case 'EN PROCESO':
        return 'pi pi-spin pi-spinner text-blue-600';
      case 'LISTO PARA RECOGER':
        return 'pi pi-shopping-bag text-blue-600';
      case 'EN CAMINO':
        return 'pi pi-truck text-blue-600';
      default:
        return 'pi pi-info-circle text-gray-600';
    }
  }

  calculateProgress(estimatedTime: number): number {
    const maxTime = 60;
    return Math.min((estimatedTime / maxTime) * 100, 100);
  }

  calculateTimelineProgress(orderStatus: string): number {
    if (!this.order || !this.order.timelineSteps) return 0;

    const timeline = this.order.timelineSteps;

    const currentIndex = timeline.findIndex(
      (s) => s.name.toLowerCase() === orderStatus.toLowerCase()
    );
    if (currentIndex === -1) return 0;

    const totalSteps = timeline.length - 1;
    if (totalSteps === 0) return 100;

    return (currentIndex / totalSteps) * 100;
  }
}
