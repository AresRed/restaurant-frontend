import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
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
export class CheckoutStepPaymentComponent {
  @Input() total = 0;
  @Input() mercadoPagoPublicKey!: string;
  @Output() back = new EventEmitter<void>();
  @Output() token = new EventEmitter<any>();

  paymentMethod = 'card';
}
