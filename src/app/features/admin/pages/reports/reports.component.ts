import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ReportSummaryResponse } from '../../../../core/models/reports/reports.model';
import { ReportService } from '../../../../core/services/reports/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reportData!: ReportSummaryResponse;

  salesToday = 0;
  totalOrders = 0;
  topProductName = '-';

  salesChartData: any;
  salesChartOptions: any;

  productsChartData: any;
  productsChartOptions: any;

  orderTypeChartData: any;
  orderTypeChartOptions: any;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReportSummary();
  }

  loadReportSummary() {
    this.reportService.getReportSummary().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.reportData = res.data;
          this.salesToday = res.data.salesToday;
          this.totalOrders = res.data.totalOrders;
          this.topProductName =
            res.data.topProducts?.[0]?.productName ?? 'Sin datos';

          this.loadCharts(res.data);
        }
      },
      error: (err) => console.error('Error al cargar reportes:', err),
    });
  }

  loadCharts(data: ReportSummaryResponse) {
    const salesLabels = Object.keys(data.salesLast7Days);
    const salesValues = Object.values(data.salesLast7Days);

    this.salesChartData = {
      labels: salesLabels,
      datasets: [
        {
          label: 'Ventas (S/.)',
          data: salesValues,
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

    const productLabels = data.topProducts.map((p) => p.productName);
    const productValues = data.topProducts.map((p) => p.totalQuantitySold);

    this.productsChartData = {
      labels: productLabels,
      datasets: [
        {
          label: 'Unidades Vendidas',
          data: productValues,
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

    const orderTypeLabels = data.orderTypes.map((t) => t.orderTypeName);
    const orderTypeValues = data.orderTypes.map((t) => t.totalOrders);

    this.orderTypeChartData = {
      labels: orderTypeLabels,
      datasets: [
        {
          data: orderTypeValues,
          backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#F87171'],
        },
      ],
    };
    this.orderTypeChartOptions = {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    };
  }
}
