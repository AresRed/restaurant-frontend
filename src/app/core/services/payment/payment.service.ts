import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OnlineCheckoutRequest, PaymentResponse } from '../../models/payment/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  createOnlinePayment(
    request: OnlineCheckoutRequest
  ): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${environment.apiUrl}/api/v1/payments/online`,
      request
    );
  }
}
