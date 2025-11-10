import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InventoryResponse } from '../../../../core/models/products/inventory/inventory.model';
import {
  ConfirmOptions,
  ConfirmService,
} from '../../../../core/services/confirmation.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { InventoryService } from '../../../../core/services/products/inventory/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    ChartModule,
    TooltipModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventories: InventoryResponse[] = [];

  categoryChartData: any;
  statusChartData: any;
  chartOptions: any;

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryService.getAllInventory().subscribe({
      next: (res) => {
        if (res.success) {
          this.inventories = res.data;
          this.buildCharts();
        }
      },
      error: (err) => this.notificationService.error('Error', err.message),
    });
  }

  buildCharts() {
    const labels: string[] = [];
    const stockEnBuenEstado: number[] = [];
    const stockBajo: number[] = [];
    const stockAgotado: number[] = [];

    this.inventories.forEach((i) => {
      const label = `${i.ingredientName} (${i.unitName})`;
      labels.push(label);

      if (i.currentStock === 0) {
        stockEnBuenEstado.push(0);
        stockBajo.push(0);
        stockAgotado.push(i.currentStock);
      } else if (i.currentStock < i.minimumStock) {
        stockEnBuenEstado.push(0);
        stockBajo.push(i.currentStock);
        stockAgotado.push(0);
      } else {
        stockEnBuenEstado.push(i.currentStock);
        stockBajo.push(0);
        stockAgotado.push(0);
      }
    });

    this.categoryChartData = {
      labels: labels,
      datasets: [
        {
          label: 'En buen stock',
          data: stockEnBuenEstado,
          backgroundColor: '#4CAF50',
        },
        {
          label: 'Bajo stock',
          data: stockBajo,
          backgroundColor: '#FFC107',
        },
        {
          label: 'Agotado',
          data: stockAgotado,
          backgroundColor: '#F44336',
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              const i = tooltipItem.dataIndex;
              const item = this.inventories[i];
              return `${tooltipItem.dataset.label}: ${item.currentStock} / mínimo ${item.minimumStock}`;
            },
          },
        },
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true },
      },
    };
  }

  getStockBadgeClass(item: InventoryResponse): string {
    if (item.currentStock === 0) return 'bg-red-100 text-red-800';
    if (item.currentStock < item.minimumStock)
      return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  viewItem(item: InventoryResponse) {
    this.router.navigate(['admin/inventory', item.id]);
  }

  orderMore(item: InventoryResponse) {
    this.router.navigate(['admin/inventory', item.id, 'add-stock']);
  }

  async confirmDelete(event: Event, item: InventoryResponse) {
    const options: ConfirmOptions = {
      message: `¿Seguro que deseas eliminar el inventario de "${item.ingredientName}"?`,
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      target: event.currentTarget as EventTarget,
    };

    const confirmed = await this.confirmationService.confirm(options);

    if (confirmed) {
      this.deleteInventory(item);
    }
  }

  private deleteInventory(item: InventoryResponse) {
    this.inventoryService.deleteInventory(item.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Eliminado',
          'Inventario eliminado correctamente'
        );

        this.inventories = this.inventories.filter((i) => i.id !== item.id);
        this.buildCharts();
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          err.error?.message || 'Error al eliminar inventario'
        );
      },
    });
  }

  goToForm(inventoryId?: number) {
    if (inventoryId) {
      this.router.navigate(['admin/inventory', inventoryId, 'edit']);
    } else {
      this.router.navigate(['admin/inventory/create']);
    }
  }
}
