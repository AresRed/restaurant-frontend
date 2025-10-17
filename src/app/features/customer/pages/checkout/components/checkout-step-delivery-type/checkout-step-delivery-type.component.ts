import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OrderTypeResponse } from '../../../../../../core/models/order-type.model';

@Component({
  selector: 'app-checkout-step-delivery-type',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './checkout-step-delivery-type.component.html',
  styleUrl: './checkout-step-delivery-type.component.scss',
})
export class CheckoutStepDeliveryTypeComponent {
  @Input() orderTypes: OrderTypeResponse[] = [];
  @Input() selectedOrderType: OrderTypeResponse | null = null;
  @Output() selectType = new EventEmitter<OrderTypeResponse>();
  @Output() next = new EventEmitter<void>();

  getOrderTypeIcon(code: string): { icon: string; color: string } {
    switch (code.toUpperCase()) {
      case 'DINE_IN':
        return { icon: 'pi pi-shop', color: 'text-blue-500' };
      case 'TAKE_AWAY':
        return { icon: 'pi pi-shopping-bag', color: 'text-green-500' };
      case 'DELIVERY':
        return { icon: 'pi pi-truck', color: 'text-red-500' };
      default:
        return { icon: 'pi pi-question', color: 'text-gray-500' };
    }
  }
}
