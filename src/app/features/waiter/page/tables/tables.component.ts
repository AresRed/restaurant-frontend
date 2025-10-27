import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableResponse, TableStatus } from '../../../../core/models/table.model';
import { OrdersComponent } from '../orders/orders.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';

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
  ],
  providers: [DialogService], // El DialogService debe ser proveído aquí
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
  allTables: TableResponse[] = [];
  filteredTables: TableResponse[] = [];
  searchTerm: string = '';
  selectedTable: TableResponse | null = null;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadTables();
  }

  /**
   * Carga los datos de ejemplo para las mesas.
   */
  loadTables(): void {
    this.allTables = [
      { id: 1, code: 'M1', alias: 'Mesa 1', capacity: 4, status: 'FREE', imageUrl: 'table.svg' } as TableResponse,
      { id: 2, code: 'M2', alias: 'Mesa 2', capacity: 2, status: 'OCCUPIED', imageUrl: 'table.svg' } as TableResponse,
      { id: 3, code: 'M3', alias: 'Mesa 3', capacity: 6, status: 'FREE', imageUrl: 'table.svg' } as TableResponse,
      { id: 4, code: 'M4', alias: 'Mesa 4', capacity: 4, status: 'OUT_OF_SERVICE', imageUrl: 'table.svg' } as TableResponse,
      { id: 5, code: 'M5', alias: 'Mesa 5', capacity: 8, status: 'FREE', imageUrl: 'table.svg' } as TableResponse,
      { id: 6, code: 'M6', alias: 'Mesa 6', capacity: 2, status: 'OCCUPIED', imageUrl: 'table.svg' } as TableResponse,
    ];
    this.filteredTables = this.allTables;
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
      return;
    }
    this.selectedTable = table;

    this.dialogService.open(OrdersComponent, {
      header: `Pedido para ${table.alias}`,
      width: '90%',
      style: { 'max-width': '800px' },
      modal: true,
      data: {
        table: this.selectedTable,
      },
    });
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
