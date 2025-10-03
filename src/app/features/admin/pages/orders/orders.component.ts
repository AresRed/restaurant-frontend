import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
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
import { TableService } from '../../../../core/services/table.service';

import { FloatLabel } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

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
    Dialog,
    FormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabel,
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

  statusOptions: TableMap[] = [
    { label: 'Libre', value: 'FREE' },
    { label: 'Ocupada', value: 'OCCUPIED' },
    { label: 'Fuera de servicio', value: 'OUT_OF_SERVICE' },
  ];
  filteredStatusOptions: TableMap[] = [];

  constructor(
    private orderService: OrderService,
    private tableService: TableService,
    private notificationService: NotificationService
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
}
