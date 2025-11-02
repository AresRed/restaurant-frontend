import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';

interface DeliveryOrder {
  id: number;
  customer: string;
  address: string;
  items: string[];
  total: number;
  status: 'Pendiente' | 'En Camino' | 'Entregado';
}

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    PaginatorModule,
  ],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent {
  @ViewChild('dt') dt!: Table;

  view: 'kanban' | 'table' = 'kanban';
  statusOptions = ['Pendiente', 'En Camino', 'Entregado'];

  orders: DeliveryOrder[] = [
    {
      id: 1,
      customer: 'Juan Pérez',
      address: 'Av. Lima 123',
      items: ['Pizza', 'Coca-Cola'],
      total: 25,
      status: 'Pendiente',
    },
    {
      id: 2,
      customer: 'Ana Torres',
      address: 'Calle Falsa 456',
      items: ['Burger', 'Fries'],
      total: 15,
      status: 'En Camino',
    },
    {
      id: 3,
      customer: 'Carlos Díaz',
      address: 'Jr. Arequipa 789',
      items: ['Sushi'],
      total: 30,
      status: 'Entregado',
    },
    {
      id: 4,
      customer: 'Luis Rojas',
      address: 'Av. Brasil 321',
      items: ['Ensalada', 'Agua'],
      total: 18,
      status: 'Pendiente',
    },
    {
      id: 5,
      customer: 'María López',
      address: 'Calle Unión 987',
      items: ['Taco', 'Refresco'],
      total: 22,
      status: 'En Camino',
    },
  ];

  updateStatus(order: DeliveryOrder, status: DeliveryOrder['status']) {
    order.status = status;
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Camino':
        return 'bg-blue-100 text-blue-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  }

  get pendientes() {
    return this.orders.filter((o) => o.status === 'Pendiente');
  }
  get enCamino() {
    return this.orders.filter((o) => o.status === 'En Camino');
  }
  get entregados() {
    return this.orders.filter((o) => o.status === 'Entregado');
  }
}
