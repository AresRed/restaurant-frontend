import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { OrderResponse } from '../../../../core/models/order/orderhttp/order.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
    TagModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  tableId?: number;
  orderId?: number;
  isHistoryView: boolean = false;

  order: OrderResponse | null = null;
  loading: boolean = false;
  isSaving: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {
    this.tableId = this.config.data.tableId;
    this.orderId = this.config.data.orderId;
    this.isHistoryView = this.config.data.isHistoryView || false;
  }

  ngOnInit(): void {
    if (this.orderId) {
      this.loadOrder(this.orderId);
    } else if (this.tableId) {
      this.order = null;
      this.notificationService.info(
        'Mesa Libre',
        'Añade productos para crear un nuevo pedido.'
      );
    }
  }

  /**
   * Carga una orden existente desde el backend
   */
  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.order = res.data;
        } else {
          this.notificationService.error(
            'Error',
            'No se pudo cargar la orden.'
          );
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error('Error de Red', 'No se pudo conectar.');
        console.error(err);
      },
    });
  }

  /**
   * Cierra el diálogo actual.
   */
  closeDialog(): void {
    this.ref.close();
  }

  /**
   * (Simulación) Guarda la orden nueva o modificada
   */
  saveOrder(): void {
    this.isSaving = true;

    setTimeout(() => {
      this.isSaving = false;
      this.notificationService.success('Guardado', 'Pedido actualizado');
      this.ref.close(true);
    }, 1500);
  }

  /**
   * Helper para dar color al tag de estado.
   */
  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    const s = status.toUpperCase();
    if (s.includes('COMPLETADO') || s.includes('ENTREGADO')) return 'success';
    if (s.includes('PENDIENTE')) return 'info';
    if (s.includes('EN_PROGRESO') || s.includes('PREPARANDO')) return 'warn';
    if (s.includes('CANCELADO')) return 'danger';
    return 'info';
  }
}
