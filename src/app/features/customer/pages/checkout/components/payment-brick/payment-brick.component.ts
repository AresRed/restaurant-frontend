import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';


export interface MercadoPagoCardToken {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

@Component({
  selector: 'app-payment-brick',
  imports: [CommonModule],
  templateUrl: './payment-brick.component.html',
  styleUrls: ['./payment-brick.component.scss'],
})
export class PaymentBrickComponent implements AfterViewInit, OnDestroy {
  @Input() amount = 0;
  @Input() publicKey = '';
  @Output() token = new EventEmitter<MercadoPagoCardToken>();
  @Output() ready = new EventEmitter<void>();
  @Output() brickError = new EventEmitter<any>();

  containerId = `mp-card-${Math.floor(Math.random() * 1_000_000)}`;
  private bricksInstance: any;

  constructor(private zone: NgZone) {}

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.loadMpSdk();
      const global: any = window as any;
      if (!global.MercadoPago) throw new Error('MercadoPago SDK no disponible');

      const mp = new global.MercadoPago(this.publicKey, { locale: 'es-PE' });
      const bricks = mp.bricks();

      this.bricksInstance = await bricks.create(
        'cardPayment',
        this.containerId,
        {
          initialization: {
            amount: this.amount,
            installments: 1,
          },
          customization: {
            visual: {
              style: {
                theme: 'default',
              },
            },
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              ticket: 'all',
              bankTransfer: 'all',
              wallet_purchase: 'all',
              maxInstallments: 1,
            },
          },
          callbacks: {
            onReady: () => this.zone.run(() => this.ready.emit()),
            onError: (err: any) =>
              this.zone.run(() => this.brickError.emit(err)),
            onSubmit: (cardFormData: MercadoPagoCardToken) => {
              this.zone.run(() => this.token.emit(cardFormData));
            },
          },
        }
      );
    } catch (e) {
      this.brickError.emit(e);
    }
  }

  ngOnDestroy(): void {
    if (this.bricksInstance) {
      this.bricksInstance.unmount();
    }
  }

  private loadMpSdk(): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = 'mp-sdk';
      const global: any = window as any;

      if (global.MercadoPago) return resolve();
      if (document.getElementById(id)) {
        const check = setInterval(() => {
          if (global.MercadoPago) {
            clearInterval(check);
            resolve();
          }
        }, 100);
        setTimeout(
          () => reject(new Error('Timeout cargando MercadoPago SDK')),
          10000
        );
        return;
      }

      const s = document.createElement('script');
      s.id = id;
      s.src = 'https://sdk.mercadopago.com/js/v2';
      s.onload = () => resolve();
      s.onerror = (err) => reject(err);
      document.head.appendChild(s);
    });
  }
}
