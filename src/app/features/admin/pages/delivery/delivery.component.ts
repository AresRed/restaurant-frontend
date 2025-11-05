import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import {
  OrderDetailResponse,
  OrderResponse,
} from '../../../../core/models/order/orderhttp/order.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { AssignDriverModalComponent } from './assign-driver-modal/assign-driver-modal.component';
@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    PaginatorModule,
    ProgressSpinnerModule,
    TagModule,
    MenuModule,
    DragDropModule,
    TooltipModule,
    DynamicDialogModule,
  ],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  providers: [DialogService],
})
export class DeliveryComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  ref: DynamicDialogRef | undefined;

  view: 'kanban' | 'table' = 'kanban';
  loading = true;

  orders: OrderResponse[] = [];
  loadingOrders = new Set<number>();

  kanbanColumns: { code: string; name: string; orders: OrderResponse[] }[] = [
    { code: 'PENDING_CONFIRMATION', name: 'Por Confirmar', orders: [] },
    { code: 'CONFIRMED', name: 'Confirmados (Cocina)', orders: [] },
    { code: 'IN_PROGRESS', name: 'En Preparación', orders: [] },
    { code: 'OUT_FOR_DELIVERY', name: 'En Camino', orders: [] },
    { code: 'DELIVERED', name: 'Entregados', orders: [] },
    { code: 'CANCELLED', name: 'Cancelados', orders: [] },
  ];

  statusOptions: SelectItem[] = [];

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadDeliveryOrders();
  }

  loadDeliveryOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders('DELIVERY').subscribe({
      next: (res) => {
        this.orders = res.data;
        this.buildKanbanColumns();
        this.buildStatusFilterOptions();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error(
          'Error',
          'No se pudieron cargar las órdenes de delivery'
        );
      },
    });
  }

  buildKanbanColumns(): void {
    this.kanbanColumns.forEach((col) => (col.orders = []));

    for (const order of this.orders) {
      const currentStep = order.timelineSteps.find(
        (s) => s.name === order.statusName
      );

      let columnCode = '';
      if (currentStep) {
        columnCode = currentStep.code;
      } else if (order.statusName.toUpperCase() === 'CANCELADO') {
        columnCode = 'CANCELLED';
      }

      const column = this.kanbanColumns.find((col) => col.code === columnCode);
      if (column) {
        column.orders.push(order);
      } else {
        console.warn(
          `Orden #${order.id} con estado "${order.statusName}" no tiene columna Kanban.`
        );
      }
    }
  }

  buildStatusFilterOptions(): void {
    if (this.orders.length === 0) return;
    const uniqueSteps = new Map<string, string>();
    this.orders.forEach((order) => {
      order.timelineSteps.forEach((step) => {
        uniqueSteps.set(step.name, step.name);
      });
    });

    this.statusOptions = Array.from(uniqueSteps.values()).map((name) => ({
      label: name,
      value: name,
    }));

    this.statusOptions.push({ label: 'Cancelado', value: 'Cancelado' });
  }

  drop(event: CdkDragDrop<OrderResponse[]>) {
    if (event.previousContainer === event.container) {
      // Mover dentro de la misma columna (solo visual, no API)
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Mover a una nueva columna (¡llamar a la API!)
      const order = event.previousContainer.data[event.previousIndex];
      const newColumnId = (event.container as any).id;
      const newColumn = this.kanbanColumns.find(
        (col) => col.code === newColumnId
      );

      if (!newColumn) {
        this.notificationService.error(
          'Error',
          'Columna de destino no válida.'
        );
        return;
      }

      const newStatusCode = newColumn.code;

      // --- ¡AQUÍ ESTÁ LA LÓGICA DE ACTUALIZACIÓN! ---

      // 1. Añadir al spinner local
      this.loadingOrders.add(order.id);

      // 2. Mover visualmente (optimista)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // 3. Llamar a la API
      this.orderService.updateOrderStatus(order.id, newStatusCode).subscribe({
        next: (updatedOrder) => {
          this.notificationService.success(
            'Éxito',
            `Orden #${order.id} movida a ${updatedOrder.data.statusName}`
          );

          // --- ¡¡FIX!! ---
          // 4. Actualizar el array 'this.orders' (la fuente de la verdad)
          const index = this.orders.findIndex((o) => o.id === order.id);
          if (index !== -1) {
            this.orders[index] = updatedOrder.data;
          }

          // 5. Actualizar la data en la nueva columna
          event.container.data[event.currentIndex] = updatedOrder.data;

          this.loadingOrders.delete(order.id); // 6. Quitar spinner
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se pudo mover la orden. Revirtiendo.'
          );

          // 7. Revertir el movimiento visual
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );

          this.loadingOrders.delete(order.id);
        },
      });
    }
  }

  updateStatus(order: OrderResponse, newStatusCode: string) {
    this.loadingOrders.add(order.id);
    this.orderService.updateOrderStatus(order.id, newStatusCode).subscribe({
      next: (updatedOrder) => {
        this.notificationService.success(
          'Éxito',
          `Orden #${order.id} actualizada a ${updatedOrder.data.statusName}`
        );
        const index = this.orders.findIndex((o) => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder.data;
        }
        this.buildKanbanColumns();
        this.loadingOrders.delete(order.id);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudo actualizar el estado'
        );
        this.loadingOrders.delete(order.id);
      },
    });
  }

  openAssignDriverModal(order: OrderResponse) {
    const ref = this.dialogService.open(AssignDriverModalComponent, {
      header: `Asignar Repartidor - Orden #${order.id}`,
      width: '40vw',
      closable: true,
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      contentStyle: { overflow: 'auto' },
      styleClass: 'p-fluid rounded-2xl shadow-lg',
    });

    ref.onClose.subscribe((selectedDriver) => {
      if (selectedDriver) {
        this.loadingOrders.add(order.id);
        this.orderService.assignDriver(order.id, selectedDriver.id).subscribe({
          next: (updatedOrder) => {
            this.notificationService.success(
              'Éxito',
              `Repartidor asignado: ${selectedDriver.fullName}`
            );
            const index = this.orders.findIndex((o) => o.id === order.id);
            if (index !== -1) {
              this.orders[index] = updatedOrder.data;
            }
            this.buildKanbanColumns();
            this.loadingOrders.delete(order.id);
          },
          error: () => {
            this.notificationService.error(
              'Error',
              'No se pudo asignar el repartidor'
            );
            this.loadingOrders.delete(order.id);
          },
        });
      }
    });
  }

  getProductNames(details: OrderDetailResponse[]): string {
    if (!details) return '';
    return details.map((d) => d.productName).join(', ');
  }

  verDetalleModal(order: OrderResponse) {}

  getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case 'PENDIENTE DE CONFIRMACIÓN':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN CAMINO':
      case 'EN PROCESO':
        return 'bg-blue-100 text-blue-800';
      case 'ENTREGADO':
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
