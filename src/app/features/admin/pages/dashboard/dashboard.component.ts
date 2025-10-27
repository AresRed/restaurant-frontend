import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { DashboardSummaryResponse } from '../../../../core/models/dashboard/dashboard.model';
import { UserResponse } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardService } from '../../../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  user$!: Observable<UserResponse | null>;
  dashboardData?: DashboardSummaryResponse;

  stats = [
    {
      title: 'Órdenes de hoy',
      value: 0,
      icon: 'pi pi-shopping-cart',
      color: 'stat-blue text-white',
    },
    {
      title: 'Ventas de hoy',
      value: 'S/ 0.00',
      icon: 'pi pi-dollar',
      color: 'stat-cyan text-white',
    },
    {
      title: 'Reservaciones',
      value: 0,
      icon: 'pi pi-calendar',
      color: 'stat-pink text-white',
    },
    {
      title: 'Satisfacción',
      value: '0%',
      icon: 'pi pi-star',
      color: 'stat-yellow text-white',
    },
  ];

  chartData: any;
  chartOrdersReservations: any;
  chartOptions: any;

  loading = true;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
    this.loadDashboardData();
    this.initializeCharts();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (res) => {
        this.dashboardData = res.data;
        this.updateStats();
        this.updateCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando el dashboard:', err);
        this.loading = false;
      },
    });
  }

  updateStats(): void {
    if (!this.dashboardData) return;
    this.stats = [
      {
        title: 'Órdenes de hoy',
        value: this.dashboardData.ordersToday,
        icon: 'pi pi-shopping-cart',
        color: 'stat-blue text-white',
      },
      {
        title: 'Ventas de hoy',
        value: `S/ ${this.dashboardData.salesToday.toFixed(2)}`,
        icon: 'pi pi-dollar',
        color: 'stat-cyan text-white',
      },
      {
        title: 'Reservaciones',
        value: this.dashboardData.reservationsToday,
        icon: 'pi pi-calendar',
        color: 'stat-pink text-white',
      },
      {
        title: 'Satisfacción',
        value: `${this.dashboardData.satisfaction}%`,
        icon: 'pi pi-star',
        color: 'stat-yellow text-white',
      },
    ];
  }

  updateCharts(): void {
    if (!this.dashboardData) return;

    const orderDates = Object.keys(this.dashboardData.ordersWeek).sort();
    const salesDates = Object.keys(this.dashboardData.salesWeek).sort();
    const reservationDates = Object.keys(
      this.dashboardData.reservationsWeek
    ).sort();

    const formatLabel = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return this.days[date.getUTCDay()];
    };

    this.chartData = {
      labels: salesDates.map(formatLabel),
      datasets: [
        {
          label: 'Ventas (S/)',
          data: salesDates.map(
            (date) => +this.dashboardData!.salesWeek[date].toFixed(2)
          ),
          backgroundColor: '#42A5F5',
        },
      ],
    };

    this.chartOrdersReservations = {
      labels: reservationDates.map(formatLabel), // usa las mismas etiquetas que reservations
      datasets: [
        {
          label: 'Órdenes',
          data: orderDates.map((date) => this.dashboardData!.ordersWeek[date]),
          borderColor: '#4CAF50',
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Reservaciones',
          data: reservationDates.map(
            (date) => this.dashboardData!.reservationsWeek[date]
          ),
          borderColor: '#FF9800',
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }

  initializeCharts(): void {
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
