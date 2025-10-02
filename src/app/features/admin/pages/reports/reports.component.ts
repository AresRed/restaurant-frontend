import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  salesChartData: any;
  salesChartOptions: any;

  productsChartData: any;
  productsChartOptions: any;

  orderTypeChartData: any;
  orderTypeChartOptions: any;

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts() {
    // 📈 Ventas semanales
    this.salesChartData = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Ventas (S/.)',
          data: [320, 450, 280, 520, 610, 700, 640],
          fill: false,
          borderColor: '#4F46E5',
          tension: 0.4,
        },
      ],
    };
    this.salesChartOptions = {
      responsive: true,
      plugins: { legend: { display: false } },
    };

    // 🥘 Productos más vendidos
    this.productsChartData = {
      labels: [
        'Arroz Chaufa',
        'Pollo a la Brasa',
        'Ceviche',
        'Lomo Saltado',
        'Papas Fritas',
      ],
      datasets: [
        {
          label: 'Unidades Vendidas',
          data: [120, 200, 150, 180, 90],
          backgroundColor: [
            '#34D399',
            '#60A5FA',
            '#FBBF24',
            '#F87171',
            '#A78BFA',
          ],
        },
      ],
    };
    this.productsChartOptions = {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
    };

    // 📊 Tipos de orden
    this.orderTypeChartData = {
      labels: ['Delivery', 'Recogo', 'En Mesa'],
      datasets: [
        {
          data: [45, 25, 30],
          backgroundColor: ['#3B82F6', '#F59E0B', '#10B981'],
        },
      ],
    };
    this.orderTypeChartOptions = {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    };
  }
}
