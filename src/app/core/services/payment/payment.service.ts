import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  OnlineCheckoutRequest,
  PaymentResponse,
} from '../../models/payment/payment.model';

export interface PaymentFilters {
  customerId?: number;
  paymentMethodId?: number;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  getPayments(filters: PaymentFilters) {
    let params = new HttpParams();

    // Construimos los parámetros de la URL dinámicamente
    if (filters.customerId) {
      params = params.set('customerId', filters.customerId.toString());
    }
    if (filters.paymentMethodId) {
      params = params.set(
        'paymentMethodId',
        filters.paymentMethodId.toString()
      );
    }
    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo);
    }

    return this.http.get<ApiResponse<PaymentResponse[]>>(
      `${environment.apiUrl}/api/v1/payments`,
      { params }
    );
  }

  createOnlinePayment(
    request: OnlineCheckoutRequest
  ): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${environment.apiUrl}/api/v1/payments/online`,
      request
    );
  }
}
