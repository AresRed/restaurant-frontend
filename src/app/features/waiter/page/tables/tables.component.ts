import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import {
  TableRequest,
  TableResponse,
  TableStatus,
} from '../../../../core/models/table.model';
import { OrdersComponent } from '../orders/orders.component';

import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import {
  ConfirmOptions,
  ConfirmService,
} from '../../../../core/services/confirmation.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TableService } from '../../../../core/services/restaurant/table.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    CardModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    DynamicDialogModule,
    ProgressSpinnerModule,
    ContextMenuModule,
  ],
  providers: [DialogService],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
  allTables: TableResponse[] = [];
  filteredTables: TableResponse[] = [];
  searchTerm: string = '';
  selectedTable: TableResponse | null = null;
  loading: boolean = false;
  dialogRef: DynamicDialogRef | undefined;

  contextMenuItems: MenuItem[] = [];
  selectedTableForMenu: TableResponse | null = null;

  constructor(
    private dialogService: DialogService,
    private tableService: TableService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.loading = true;
    this.tableService.getAllTables().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allTables = res.data;
          this.filterTables();
        } else {
          this.notificationService.error(
            'Error',
            'No se pudieron cargar los datos de las mesas.'
          );
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error(
          'Error de Red',
          'No se pudo conectar al servidor para cargar las mesas.'
        );
        console.error(err);
      },
    });
  }

  /**
   * Filtra las mesas basándose en el término de búsqueda.
   */
  filterTables(): void {
    if (!this.searchTerm) {
      this.filteredTables = this.allTables;
      return;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredTables = this.allTables.filter(
      (table) =>
        table.alias.toLowerCase().includes(lowerCaseSearchTerm) ||
        table.code.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  /**
   * Abre un diálogo dinámico con el componente de órdenes al seleccionar una mesa.
   * @param table La mesa seleccionada.
   */
  selectTable(table: TableResponse): void {
    if (table.status === 'OUT_OF_SERVICE') {
      this.notificationService.warn(
        'Mesa no disponible',
        'Esta mesa se encuentra fuera de servicio.'
      );
      return;
    }

    if (table.status === 'FREE') {
      this.router.navigate(['/waiter/pos', table.id]);
    }

    if (table.status === 'OCCUPIED') {
      if (!table.activeOrderId) {
        this.notificationService.error(
          'Error de Datos',
          'La mesa está ocupada pero no tiene una orden activa. Libere la mesa manualmente.'
        );
        return;
      }

      this.dialogRef = this.dialogService.open(OrdersComponent, {
        header: `Ver Pedido de ${table.alias}`,
        width: '90%',
        style: { 'max-width': '800px' },
        modal: true,
        data: {
          orderId: table.activeOrderId,
          isHistoryView: true, 
        },
      });

      this.dialogRef.onClose.subscribe(() => {
        this.loadTables();
      });
    }
  }
  /**
   * (Clic Derecho) Muestra el menú de gestión de mesa.
   */
  onTableRightClick(event: MouseEvent, table: TableResponse) {
    this.selectedTableForMenu = table;
    this.contextMenuItems = this.buildContextMenu(table, event);
  }

  buildContextMenu(table: TableResponse, event: MouseEvent): MenuItem[] {
    const items: MenuItem[] = [];
    const target = event.currentTarget as EventTarget;

    if (table.status === 'FREE') {
      items.push({
        label: 'Fuera de Servicio',
        icon: 'pi pi-exclamation-triangle',
        command: () =>
          this.confirmChangeStatus(table, 'OUT_OF_SERVICE', target),
      });
    }

    if (table.status === 'OUT_OF_SERVICE') {
      items.push({
        label: 'Marcar como Libre',
        icon: 'pi pi-check',
        command: () => this.confirmChangeStatus(table, 'FREE', target),
      });
    }

    if (table.status === 'OCCUPIED' && !table.activeOrderId) {
      items.push({
        label: 'Forzar Liberación',
        icon: 'pi pi-sync',
        command: () => this.confirmChangeStatus(table, 'FREE', target),
      });
    }

    return items;
  }

  async confirmChangeStatus(
    table: TableResponse,
    newStatus: TableStatus,
    target: EventTarget
  ) {
    const options: ConfirmOptions = {
      message: `¿Estás seguro de que quieres cambiar la mesa ${table.alias} a "${newStatus}"?`,
      header: 'Confirmar Cambio de Estado',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sí, cambiar',
      rejectLabel: 'Cancelar',
      target: target,
    };

    const accepted = await this.confirmService.confirm(options);

    if (accepted) {
      const request: TableRequest = { ...table, status: newStatus };

      this.tableService.updateTable(table.id, request).subscribe({
        next: () => {
          this.notificationService.success(
            'Estado Actualizado',
            `La mesa ${table.alias} ahora está ${newStatus}`
          );
          this.loadTables();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se pudo actualizar el estado de la mesa.'
          );
          console.error(err);
        },
      });
    }
  }

  /**
   * Devuelve la clase CSS para el fondo de la tarjeta según el estado de la mesa.
   */
  getTableStatusClass(status: TableStatus): string {
    switch (status) {
      case 'FREE':
        return 'bg-green-100 border-green-300';
      case 'OCCUPIED':
        return 'bg-red-100 border-red-300';
      case 'OUT_OF_SERVICE':
        return 'bg-gray-200 border-gray-400 opacity-50';
      default:
        return 'bg-white';
    }
  }

  /**
   * Devuelve la severidad para el tag de PrimeNG según el estado.
   */
  getTagSeverity(status: TableStatus): 'success' | 'danger' | 'warn' | 'info' {
    switch (status) {
      case 'FREE':
        return 'success';
      case 'OCCUPIED':
        return 'danger';
      case 'OUT_OF_SERVICE':
        return 'warn';
      default:
        return 'info';
    }
  }
}
