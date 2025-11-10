import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  InventoryReportResponse,
  PaymentReportResponse,
  ReportSummaryResponse,
} from '../../../../core/models/reports/reports.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/reports/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
    ChartModule,
    CurrencyPipe,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  isLoading = signal(true);

  reportData = signal<ReportSummaryResponse | null>(null);
  salesToday = signal(0);
  totalOrders = signal(0);
  topProductName = signal('-');
  salesChartData: any;
  salesChartOptions: any;
  productsChartData: any;
  productsChartOptions: any;
  orderTypeChartData: any;
  orderTypeChartOptions: any;

  paymentsReport = signal<PaymentReportResponse[]>([]);
  paymentChartData: any;
  paymentChartOptions: any;

  inventoryReport = signal<InventoryReportResponse[]>([]);

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  loadAllReports() {
    this.isLoading.set(true);

    Promise.all([
      this.loadReportSummary(),
      this.loadPaymentsReport(),
      this.loadInventoryReport(),
    ]).finally(() => {
      this.isLoading.set(false);
    });
  }

  loadReportSummary(): Promise<void> {
    return new Promise((resolve) => {
      this.reportService.getReportSummary().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.reportData.set(res.data);
            this.salesToday.set(res.data.salesToday);
            this.totalOrders.set(res.data.totalOrders);
            this.topProductName.set(
              res.data.topProducts?.[0]?.productName ?? 'Sin datos'
            );
            this.loadSalesCharts(res.data);
          }
          resolve();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se pudo cargar el resumen de ventas.'
          );
          resolve();
        },
      });
    });
  }

  loadPaymentsReport(): Promise<void> {
    return new Promise((resolve) => {
      this.reportService.getPaymentsReport().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.paymentsReport.set(res.data);
            this.loadPaymentChart(res.data);
          }
          resolve();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se pudo cargar el reporte de pagos.'
          );
          resolve();
        },
      });
    });
  }

  loadInventoryReport(): Promise<void> {
    return new Promise((resolve) => {
      this.reportService.getInventoryReport().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.inventoryReport.set(res.data);
          }
          resolve();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se pudo cargar el reporte de inventario.'
          );
          resolve();
        },
      });
    });
  }

  loadSalesCharts(data: ReportSummaryResponse) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
    const textColorSecondary =
      documentStyle.getPropertyValue('--text-color-secondary') || '#777';
    const surfaceBorder =
      documentStyle.getPropertyValue('--surface-border') || '#eee';

    // --- 1. Gráfico de Ventas (Línea) ---
    const salesLabels = Object.keys(data.salesLast7Days).map((date) =>
      new Date(date).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'short',
      })
    );
    const salesValues = Object.values(data.salesLast7Days);

    this.salesChartData = {
      labels: salesLabels,
      datasets: [
        {
          label: 'Ventas (S/.)',
          data: salesValues,
          fill: true,
          borderColor:
            documentStyle.getPropertyValue('--blue-500') || '#3B82F6',
          tension: 0.4,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
      ],
    };
    this.salesChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => `S/ ${Number(context.raw).toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
      },
    };

    // --- 2. Gráfico de Top Productos (Barras) ---
    const productLabels = data.topProducts.map((p) => p.productName);
    const productValues = data.topProducts.map((p) => p.totalQuantitySold);

    this.productsChartData = {
      labels: productLabels,
      datasets: [
        {
          label: 'Unidades Vendidas',
          data: productValues,
          backgroundColor: [
            documentStyle.getPropertyValue('--green-400') || '#34D399',
            documentStyle.getPropertyValue('--blue-400') || '#60A5FA',
            documentStyle.getPropertyValue('--yellow-400') || '#FBBF24',
            documentStyle.getPropertyValue('--red-400') || '#F87171',
            documentStyle.getPropertyValue('--purple-400') || '#A78BFA',
          ],
          borderRadius: 4,
        },
      ],
    };
    this.productsChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // Hace el gráfico de barras horizontal
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
          beginAtZero: true,
        },
        y: {
          ticks: { color: textColor },
          grid: { display: false }, // Oculta líneas de la cuadrícula Y
        },
      },
    };

    // --- 3. Gráfico de Tipos de Orden (Dona) ---
    const orderTypeLabels = data.orderTypes.map((t) => t.orderTypeName);
    const orderTypeValues = data.orderTypes.map((t) => t.totalOrders);

    this.orderTypeChartData = {
      labels: orderTypeLabels,
      datasets: [
        {
          data: orderTypeValues,
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500') || '#3B82F6',
            documentStyle.getPropertyValue('--yellow-500') || '#F59E0B',
            documentStyle.getPropertyValue('--green-500') || '#10B981',
            documentStyle.getPropertyValue('--red-500') || '#EF4444',
          ],
        },
      ],
    };
    this.orderTypeChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor },
        },
      },
    };
  }

  loadPaymentChart(data: PaymentReportResponse[]) {
    const labels = data.map((p) => p.paymentMethodName);
    const values = data.map((p) => p.totalAmount);

    this.paymentChartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#6366F1',
          ],
        },
      ],
    };
    this.paymentChartOptions = {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    };
  }

  getInventoryStatusSeverity(status: string): 'success' | 'warn' | 'danger' {
    switch (status) {
      case 'ÓPTIMO':
        return 'success';
      case 'BAJO':
        return 'warn';
      case 'CRÍTICO':
        return 'danger';
      default:
        return 'success';
    }
  }
}
