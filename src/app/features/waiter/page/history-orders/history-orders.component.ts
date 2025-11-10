import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { OrderResponse } from '../../../../core/models/order/orderhttp/order.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { OrdersComponent } from '../orders/orders.component';

@Component({
  selector: 'app-history-orders',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    FormsModule,
    CardModule,
    TagModule,
    DatePipe,
    CurrencyPipe,
    DynamicDialogModule,
  ],
  providers: [DialogService],
  templateUrl: './history-orders.component.html',
  styleUrl: './history-orders.component.scss',
})
export class HistoryOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading: boolean = false;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Ordenar por fecha, más reciente primero
          this.orders = res.data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        } else {
          this.notificationService.error(
            'Error',
            'No se pudo cargar el historial.'
          );
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error(
          'Error de Red',
          'No se pudo conectar al servidor.'
        );
        console.error(err);
      },
    });
  }

  viewOrder(order: OrderResponse): void {
    this.dialogRef = this.dialogService.open(OrdersComponent, {
      header: `Detalles del Pedido #${order.id}`,
      width: '90%',
      style: { 'max-width': '800px' },
      modal: true,
      data: {
        orderId: order.id,
        isHistoryView: true,
      },
    });
  }

  downloadInvoice(order: OrderResponse): void {
    this.notificationService.info(
      'Descargando...',
      'Generando su comprobante.'
    );
    this.orderService.downloadInvoice(order.id).subscribe({
      next: (blob) => {
        saveAs(blob, `Comprobante-Orden-${order.id}.pdf`);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudo descargar el comprobante.'
        );
        console.error(err);
      },
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    if (status.includes('COMPLETADO') || status.includes('ENTREGADO'))
      return 'success';
    if (status.includes('PENDIENTE')) return 'info';
    if (status.includes('EN_PROGRESO') || status.includes('PREPARANDO'))
      return 'warn';
    if (status.includes('CANCELADO')) return 'danger';
    return 'info';
  }
}
