import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OnlineCheckoutRequest {
  orderId: number;
  transactionAmount: number;
  installments: number;
  token: string;
  email: string;
  docType: string;
  docNumber: string;
  paymentMethodId: string;
}


export interface PaymentResponse {
  id: number;
  orderId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  amount: number;
  date: string;
  isOnline: boolean;
  transactionCode: string;
  provider: string;
  status: string;
}

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
