import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

declare var MercadoPago: any;

export interface OnlineCheckoutRequest {
  orderId: number;
  token: string;
  provider: string;
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
  private publicKey = environment.mercadoPagoPublicKey;

  constructor(private http: HttpClient) {}

  async createCardToken(cardData: any): Promise<string> {
    const mp = new MercadoPago(this.publicKey, { locale: 'es-PE' });

    const cleanCardNumber = cardData.number.replace(/\s+/g, '');
    const [expMonth, expYear] = cardData.expiration.split('/');
    const fullYear = expYear.length === 2 ? `20${expYear}` : expYear;

    const result = await mp.createCardToken({
      cardNumber: cleanCardNumber,
      expirationMonth: expMonth,
      expirationYear: fullYear,
      securityCode: cardData.cvv,
      cardholderName: cardData.holder,
      identificationType: 'DNI',
      identificationNumber: cardData.doc,
    });

    return result.id;
  }

  createOnlinePayment(
    request: OnlineCheckoutRequest
  ): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${environment.apiUrl}/api/v1/payments/online`,
      request
    );
  }

  async payWithCard(orderId: number, cardData: any): Promise<PaymentResponse> {
    try {
      const token = await this.createCardToken(cardData);

      const request: OnlineCheckoutRequest = {
        orderId,
        token,
        provider: 'MERCADOPAGO',
      };

      return await firstValueFrom(this.createOnlinePayment(request));
    } catch (error) {
      console.error('Error al procesar el pago', error);
      throw error;
    }
  }
}
