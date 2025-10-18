import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DeliveryAddressRequest } from '../../../../../../core/models/order.model';
import { DeliveryModeComponent } from './modes/delivery-mode/delivery-mode.component';
import { DineInModeComponent } from './modes/dine-in-mode/dine-in-mode.component';
import { TakeAwayModeComponent } from './modes/take-away-mode/take-away-mode.component';

declare var google: any;

export interface CheckoutStep2Data {
  deliveryAddress?: DeliveryAddressRequest;
  dineIn?: { tableId: number | null };
  takeAway?: { storeId: number | null };
}

@Component({
  selector: 'app-checkout-step-address',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    ProgressSpinnerModule,
    DeliveryModeComponent,
    DineInModeComponent,
    TakeAwayModeComponent,
  ],
  templateUrl: './checkout-step-address.component.html',
  styleUrl: './checkout-step-address.component.scss',
})
export class CheckoutStepAddressComponent {
  @Input() selectedOrderTypeCode: string = '';
  @Output() next = new EventEmitter<CheckoutStep2Data>();
  @Output() back = new EventEmitter<void>();

  onNext(data: CheckoutStep2Data) {
    this.next.emit(data);
  }

  isDelivery = () => this.selectedOrderTypeCode === 'DELIVERY';
  isTakeAway = () => this.selectedOrderTypeCode === 'TAKE_AWAY';
  isDineIn = () => this.selectedOrderTypeCode === 'DINE_IN';
}
