import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { OrderResponse } from '../../../../core/models/order/orderhttp/order.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';

// Tipo para el timer mejorado
type OrderTimer = {
  time: string;
  isUrgent: boolean;
};

@Component({
  selector: 'app-kitchen-orders',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, ButtonModule, TagModule],
  templateUrl: './kitchen-orders.component.html',
  styleUrl: './kitchen-orders.component.scss',
})
export class KitchenOrdersComponent implements OnInit, OnDestroy {
  public pendingOrders: OrderResponse[] = [];
  public confirmedOrders: OrderResponse[] = [];
  public inProgressOrders: OrderResponse[] = [];

  public loading = false;
  public updatingOrders = new Set<number>();

  public orderTimers = new Map<number, OrderTimer>();
  private timerInterval: any;

  private readonly NEXT_STATE_MAP: Record<string, string> = {
    PENDING_CONFIRMATION: 'CONFIRMED',
    CONFIRMED: 'IN_PROGRESS',
    IN_PROGRESS: 'COMPLETED',
  };

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.timerInterval = setInterval(() => {
      this.updateAllTimers();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const allOrders = res.data.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          this.pendingOrders = allOrders.filter(
            (o) => o.statusCode === 'PENDING_CONFIRMATION'
          );
          this.confirmedOrders = allOrders.filter(
            (o) => o.statusCode === 'CONFIRMED'
          );
          this.inProgressOrders = allOrders.filter(
            (o) => o.statusCode === 'IN_PROGRESS'
          );

          this.updateAllTimers();
        } else {
          this.notificationService.error(
            'Error',
            'No se pudieron cargar las órdenes.'
          );
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error(
          'Error',
          'No se pudieron cargar las órdenes.'
        );
      },
    });
  }

  updateAllTimers(): void {
    const now = new Date();
    [
      ...this.pendingOrders,
      ...this.confirmedOrders,
      ...this.inProgressOrders,
    ].forEach((order) => {
      this.orderTimers.set(order.id, this.getElapsedTime(order.date, now));
    });
  }

  getElapsedTime(orderDate: string, now: Date): OrderTimer {
    const startDate = new Date(orderDate);
    const diffMs = now.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    return {
      time: `${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(
        2,
        '0'
      )}`,
      isUrgent: diffMins >= 10,
    };
  }

  updateStatus(order: OrderResponse): void {
    const currentCode = order.statusCode;
    const newStatusCode = this.NEXT_STATE_MAP[currentCode];

    if (!newStatusCode) {
      this.notificationService.warn(
        'Error',
        'No hay un siguiente estado definido.'
      );
      return;
    }

    this.updatingOrders.add(order.id);

    this.orderService.updateOrderStatus(order.id, newStatusCode).subscribe({
      next: (res) => {
        this.notificationService.success(
          'Actualizado',
          `Orden #${order.id} marcada como ${res.data.statusName}`
        );
        this.loadOrders();
        this.updatingOrders.delete(order.id);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudo actualizar la orden.'
        );
        this.updatingOrders.delete(order.id);
      },
    });
  }

  isOrderUpdating(orderId: number): boolean {
    return this.updatingOrders.has(orderId);
  }

  // Helper para el HTML
  getTotalOrders(): number {
    return (
      this.pendingOrders.length +
      this.confirmedOrders.length +
      this.inProgressOrders.length
    );
  }
}
