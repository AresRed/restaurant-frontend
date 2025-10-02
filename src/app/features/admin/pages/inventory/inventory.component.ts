import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  unit: string; // Ej: Kg, L, Unidades
  stock: number;
  minStock: number; // Stock mínimo requerido
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, BadgeModule, ChartModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventory: InventoryItem[] = [];

  categoryChartData: any;
  statusChartData: any;
  chartOptions: any;

  ngOnInit(): void {
    this.loadInventory();
    this.buildCharts();
  }

  loadInventory() {
    // 🔥 Normalmente vendría del backend
    this.inventory = [
      {
        id: 1,
        name: 'Arroz',
        category: 'Granos',
        unit: 'Kg',
        stock: 50,
        minStock: 10,
      },
      {
        id: 2,
        name: 'Aceite Vegetal',
        category: 'Aceites',
        unit: 'L',
        stock: 5,
        minStock: 8,
      },
      {
        id: 3,
        name: 'Pechuga de Pollo',
        category: 'Carnes',
        unit: 'Kg',
        stock: 0,
        minStock: 5,
      },
      {
        id: 4,
        name: 'Papas',
        category: 'Verduras',
        unit: 'Kg',
        stock: 20,
        minStock: 15,
      },
      {
        id: 5,
        name: 'Lechuga',
        category: 'Verduras',
        unit: 'Kg',
        stock: 8,
        minStock: 5,
      },
    ];
  }

  buildCharts() {
    // 📦 Conteo por categoría
    const categoryCounts: Record<string, number> = {};
    this.inventory.forEach((i) => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });

    this.categoryChartData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          data: Object.values(categoryCounts),
          backgroundColor: [
            '#4CAF50',
            '#2196F3',
            '#FF9800',
            '#9C27B0',
            '#E91E63',
          ],
        },
      ],
    };

    // 📊 Estado del inventario
    let enStock = 0;
    let bajo = 0;
    let agotado = 0;
    this.inventory.forEach((i) => {
      if (i.stock === 0) agotado++;
      else if (i.stock < i.minStock) bajo++;
      else enStock++;
    });

    this.statusChartData = {
      labels: ['En buen stock', 'Bajo stock', 'Agotado'],
      datasets: [
        {
          data: [enStock, bajo, agotado],
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        },
      ],
    };

    // 🎨 Opciones comunes
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    };
  }

  getStockBadgeClass(item: InventoryItem): string {
    if (item.stock === 0) return 'bg-red-100 text-red-800';
    if (item.stock < item.minStock) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  viewItem(item: InventoryItem) {
    console.log('Detalles del producto:', item);
  }

  orderMore(item: InventoryItem) {
    console.log(`Solicitar más stock de: ${item.name}`);
  }
}
