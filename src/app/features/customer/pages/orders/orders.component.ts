import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../../environments/environment';
import {
  OrderResponse,
  OrderStatusStepResponse,
} from '../../../../core/models/order/orderhttp/order.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { ReviewModalComponent } from '../../components/review-modal/review-modal.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    TooltipModule,
    ReviewModalComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;
  googleMapsApiKey = environment.googleMapsApiKey;

  displayReviewModal = false;
  reviewResourceId: number | null = null;
  reviewResourceType: 'order' | 'product' | null = null;
  reviewResourceName: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrdersAuth().subscribe({
      next: (res) => {
        this.orders = res.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando órdenes', err);
        this.loading = false;
      },
    });
  }

  viewOrderDetail(orderId: number) {
    this.router.navigate(['/profile/orders', orderId]);
  }

  reorder(orderId: number) {
    console.log('Implementar lógica para reordenar la orden #', orderId);
  }

  openReviewModal(id: number, type: 'order' | 'product', name: string) {
    this.reviewResourceId = id;
    this.reviewResourceType = type;
    this.reviewResourceName = name;
    this.displayReviewModal = true;
  }

  onReviewModalClosed() {
    this.displayReviewModal = false;
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

    if (stepIndex < orderIndex) {
      return 'completed';
    }
    if (stepIndex === orderIndex) {
      return 'current';
    }
    return 'upcoming';
  }

  getStepIcon(stepName: string): string {
    switch (stepName.toLowerCase()) {
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
}
