import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  CashClosingReportResponse,
  CashClosingSessionResponse,
  CashClosingSubmitRequest,
} from '../../models/cash-closing/cash-closing.model';

@Injectable({
  providedIn: 'root',
})
export class CashClosingService {
  constructor(private http: HttpClient) {}

  getCurrentReport() {
    return this.http.get<ApiResponse<CashClosingReportResponse>>(
      `${environment.apiUrl}/api/v1/cash-closing/report`
    );
  }

  getHistory() {
    return this.http.get<ApiResponse<CashClosingSessionResponse[]>>(
      `${environment.apiUrl}/api/v1/cash-closing/history`
    );
  }

  submitCashClosing(request: CashClosingSubmitRequest) {
    return this.http.post<ApiResponse<void>>(
      `${environment.apiUrl}/api/v1/cash-closing/submit`,
      request
    );
  }
}
