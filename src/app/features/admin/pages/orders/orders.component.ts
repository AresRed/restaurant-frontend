import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { OrderResponse } from '../../../../core/models/order.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  tables = [
    { number: 1, status: 'FREE' },
    { number: 2, status: 'OCCUPIED', orderId: 102 },
    { number: 3, status: 'RESERVED' },
    { number: 4, status: 'OCCUPIED', orderId: 108 },
    { number: 5, status: 'FREE' },
    { number: 6, status: 'RESERVED' },
  ];

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
      },
      error: (err) => {
        this.notificationService.error('Error', err);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  }

  selectTable(table: any) {
    console.log('Mesa seleccionada:', table);
    // Aquí puedes abrir un modal para ver o asignar orden
  }

  viewOrder(order: OrderResponse) {
    console.log('Detalles de la orden:', order);
  }

  cancelOrder(order: OrderResponse) {
    console.log('Cancelando orden:', order);
  }
}
