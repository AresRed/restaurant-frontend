import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare var MercadoPago: any;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private publicKey = environment.mercadoPagoPublicKey;

  constructor(private http: HttpClient) {}

  createPreference(items: any) {
    return this.http.post<{ id: string }>(
      'http://localhost:8080/api/mercadopago/create-preference',
      { items }
    );
  }

  checkout(preferenceId: string) {
    const mp = new MercadoPago(this.publicKey, { locale: 'es-PE' });
    mp.checkout({
      preference: { id: preferenceId },
      autoOpen: true,
    });
  }
}
