import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { ReportSummaryResponse } from '../../models/reports/reports.model';

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
}
