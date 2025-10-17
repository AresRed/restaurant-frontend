import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OrderResponse } from '../../../../core/models/order.model';
import {
  TableResponse,
  TableStatus,
} from '../../../../core/models/table.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { TableService } from '../../../../core/services/restaurant/table.service';

import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../../environments/environment';

interface TableMap {
  label: string;
  value: TableStatus;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
    PanelModule,
    AvatarModule,
    FloatLabelModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  tables: TableResponse[] = [];
  dialogTableVisible = false;
  selectedTable: TableResponse = {} as TableResponse;
  googleMapsApiKey = environment.googleMapsApiKey;

  statusOptions: TableMap[] = [
    { label: 'Libre', value: 'FREE' },
    { label: 'Ocupada', value: 'OCCUPIED' },
    { label: 'Fuera de servicio', value: 'OUT_OF_SERVICE' },
  ];
  filteredStatusOptions: TableMap[] = [];

  constructor(
    private orderService: OrderService,
    private tableService: TableService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.loadTables();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res) => (this.orders = res.data),
      error: (err) => this.notificationService.error('Error', err),
    });
  }

  loadTables() {
    this.tableService.getAllTables().subscribe({
      next: (res) => {
        if (res.success) this.tables = res.data;
      },
      error: (err) => this.notificationService.error('Error', err),
    });
  }

  openTableActions(table: TableResponse) {
    this.selectedTable = { ...table };
    this.dialogTableVisible = true;
  }

  saveTable() {
    this.tableService
      .updateTable(this.selectedTable.id, this.selectedTable)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.notificationService.success(
              'Mesa actualizada',
              'Los cambios se guardaron correctamente.'
            );
            this.loadTables();
            this.dialogTableVisible = false;
          }
        },
        error: (err: HttpErrorResponse) => {
          this.notificationService.error('Error', err.message);
        },
      });
  }

  searchTableState(event: AutoCompleteCompleteEvent) {
    const query = (event.query ?? '').toLowerCase();

    this.filteredStatusOptions = this.statusOptions.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'COMPLETADA':
      case 'CONFIRMADA':
        return 'success';
      case 'PENDIENTE':
        return 'warn';
      case 'CANCELADA':
        return 'danger';
      case 'EN PROGRESO':
        return 'info';
      default:
        return 'secondary';
    }
  }

  viewOrderDetail(orderId: number) {
    this.router.navigate(['/admin/orders', orderId]);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
