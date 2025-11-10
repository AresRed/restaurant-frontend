import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  InventoryReportResponse,
  PaymentReportResponse,
  ReportSummaryResponse,
} from '../../models/reports/reports.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getReportSummary(): Observable<ApiResponse<ReportSummaryResponse>> {
    return this.http.get<ApiResponse<ReportSummaryResponse>>(
      `${environment.apiUrl}/api/v1/reports/summary`
    );
  }
  /**
   * Obtiene el resumen de Pagos por método
   */
  getPaymentsReport() {
    return this.http.get<ApiResponse<PaymentReportResponse[]>>(
      `${environment.apiUrl}/api/v1/reports/payments`
    );
  }

  /**
   * Obtiene el reporte de Inventario
   */
  getInventoryReport() {
    return this.http.get<ApiResponse<InventoryReportResponse[]>>(
      `${environment.apiUrl}/api/v1/reports/inventory`
    );
  }
}
