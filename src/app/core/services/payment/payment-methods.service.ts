import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { PaymentMethodResponse } from '../../models/payment/payment-method.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  constructor(private http: HttpClient) {}

  getAllPaymentMethods() {
    return this.http.get<ApiResponse<PaymentMethodResponse[]>>(
      `${environment.apiUrl}/api/v1/payment-methods`
    );
  }

  getPaymentMethodById(paymentMethodId: number) {
    return this.http.get<ApiResponse<PaymentMethodResponse>>(
      `${environment.apiUrl}/api/v1/payment-methods/${paymentMethodId}`
    );
  }

  addPaymentMethod() {}

  updatePaymentMethod() {}

  deletePaymentMethod() {}
}
