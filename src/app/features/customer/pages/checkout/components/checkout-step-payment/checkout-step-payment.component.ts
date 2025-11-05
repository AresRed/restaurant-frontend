import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaymentInOrderRequest } from '../../../../../../core/models/order/orderhttp/order.model';
import { PaymentBrickComponent } from '../payment-brick/payment-brick.component';

@Component({
  selector: 'app-checkout-step-payment',
  imports: [
    CommonModule,
    ButtonModule,
    RadioButtonModule,
    PaymentBrickComponent,
    FormsModule,
  ],
  templateUrl: './checkout-step-payment.component.html',
  styleUrl: './checkout-step-payment.component.scss',
})
export class CheckoutStepPaymentComponent implements OnChanges {
  @Input() total = 0;
  @Input() mercadoPagoPublicKey!: string;
  @Input() orderType: string | undefined = '';

  @Output() back = new EventEmitter<void>();
  @Output() token = new EventEmitter<any>();
  @Output() confirmLocal = new EventEmitter<PaymentInOrderRequest>();

  paymentMethod = 'card';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderType']) {
      if (this.orderType === 'DINE_IN') {
        this.paymentMethod = 'local';
      } else {
        this.paymentMethod = 'card';
      }
    }
  }
  onConfirmLocalPayment() {
    this.confirmLocal.emit({
      paymentMethodId: 1,
      amount: this.total,
      isOnline: false,
      status: 'CONFIRMED',
    });
  }
}
