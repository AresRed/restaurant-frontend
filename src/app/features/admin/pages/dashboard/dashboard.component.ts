import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  userName = 'Administrador';

  stats = [
    {
      title: 'Órdenes de hoy',
      value: 45,
      icon: 'pi pi-shopping-cart',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Ventas de hoy',
      value: '$1,250',
      icon: 'pi pi-dollar',
      color: 'from-red-500 to-red-600',
    },
    {
      title: 'Reservaciones',
      value: 12,
      icon: 'pi pi-calendar',
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Satisfacción',
      value: '92%',
      icon: 'pi pi-star',
      color: 'from-yellow-400 to-yellow-500',
    },
  ];

  chartData: any;
  chartOrdersReservations: any;
  chartOptions: any;

  inventoryAlerts = [
    { name: 'Carne de res', stock: 5 },
    { name: 'Papas', stock: 10 },
    { name: 'Cerveza artesanal', stock: 3 },
  ];

  reservations = [
    { client: 'Juan Pérez', date: '2025-10-01', time: '19:00', people: 4 },
    { client: 'María López', date: '2025-10-01', time: '20:30', people: 2 },
    { client: 'Carlos Gómez', date: '2025-10-02', time: '18:45', people: 6 },
  ];

  reviews = [
    {
      client: 'Lucía Fernández',
      date: '2025-09-29',
      comment: 'Excelente atención y comida deliciosa.',
      rating: 5,
    },
    {
      client: 'Pedro Ramos',
      date: '2025-09-28',
      comment: 'La reservación salió perfecta, volveré pronto.',
      rating: 4,
    },
    {
      client: 'Ana Torres',
      date: '2025-09-27',
      comment: 'Todo bien, pero la espera fue un poco larga.',
      rating: 3,
    },
  ];

  constructor() {
    this.chartData = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Ventas ($)',
          data: [200, 450, 300, 600, 750, 900, 400],
          backgroundColor: '#42A5F5',
        },
      ],
    };

    this.chartOrdersReservations = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Órdenes',
          data: [40, 55, 32, 70, 65, 80, 50],
          borderColor: '#4CAF50',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Reservaciones',
          data: [10, 12, 8, 15, 14, 18, 9],
          borderColor: '#FF9800',
          tension: 0.4,
          fill: false,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#374151' } },
      },
      scales: {
        x: { ticks: { color: '#6B7280' }, grid: { color: '#E5E7EB' } },
        y: { ticks: { color: '#6B7280' }, grid: { color: '#E5E7EB' } },
      },
    };
  }
}
