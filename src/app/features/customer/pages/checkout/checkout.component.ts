import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CartItem } from '../../../../core/models/cart.model';
import { OrderTypeResponse } from '../../../../core/models/order-type.model';
import {
  DeliveryAddressRequest,
  OrderRequest,
} from '../../../../core/models/order.model';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderTypeService } from '../../../../core/services/orders/order-type.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { PaymentService } from '../../../../core/services/payment.service';
import {
  CheckoutStep2Data,
  CheckoutStepAddressComponent,
} from './components/checkout-step-address/checkout-step-address.component';
import { CheckoutStepDeliveryTypeComponent } from './components/checkout-step-delivery-type/checkout-step-delivery-type.component';
import { CheckoutStepPaymentComponent } from './components/checkout-step-payment/checkout-step-payment.component';
import { MercadoPagoCardToken } from './components/payment-brick/payment-brick.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepperModule,
    ButtonModule,
    CheckoutStepPaymentComponent,
    CheckoutStepAddressComponent,
    CheckoutStepDeliveryTypeComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  activeStepIndex: number = 0;
  mercadoPagoPublicKey = environment.mercadoPagoPublicKey;

  orderTypes: OrderTypeResponse[] = [];
  selectedOrderType: OrderTypeResponse | null = null;

  selectedDeliveryAddress: DeliveryAddressRequest | null = null;
  selectedTableId: number | null = null;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private orderTypeService: OrderTypeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });

    this.loadOrderTypes();
  }

  goToStep(step: number) {
    this.activeStepIndex = step;
  }

  loadOrderTypes() {
    this.orderTypeService.getAllOrderTypes().subscribe({
      next: (res) => {
        if (res.success) {
          this.orderTypes = res.data;
          if (this.orderTypes.length > 0) {
            this.selectedOrderType = this.orderTypes[0];
          }
        }
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los tipos de orden'
        );
      },
    });
  }

  handleAddressSelected(address: DeliveryAddressRequest) {
    this.selectedDeliveryAddress = address;
    console.log(
      'Dirección recibida y guardada en el padre:',
      this.selectedDeliveryAddress
    );
    this.goToStep(2);
  }

  async handleBrickToken(tokenData: MercadoPagoCardToken) {
    try {
      if (this.isDelivery() && !this.selectedDeliveryAddress) {
        this.notificationService.error(
          'Error',
          'Por favor, selecciona una dirección de entrega.'
        );
        return;
      }
      if (this.isDineIn() && !this.selectedTableId) {
        this.notificationService.error(
          'Error',
          'Por favor, selecciona una mesa.'
        );
        return;
      }

      const orderPayload: OrderRequest = {
        statusId: 1,
        typeId: this.selectedOrderType!.id,
        details: this.items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      if (this.isDelivery()) {
        orderPayload.deliveryAddress = this.selectedDeliveryAddress!;
      } else if (this.isDineIn()) {
        orderPayload.tableId = this.selectedTableId!;
      }

      const orderResponse = await firstValueFrom(
        this.orderService.createOrder(orderPayload)
      );

      const payer = tokenData.payer;
      await firstValueFrom(
        this.paymentService.createOnlinePayment({
          orderId: orderResponse.data.id,
          transactionAmount: tokenData.transaction_amount,
          installments: tokenData.installments,
          token: tokenData.token,
          email: payer.email,
          docType: payer.identification.type,
          docNumber: payer.identification.number,
          paymentMethodId: tokenData.payment_method_id,
        })
      );

      this.notificationService.success(
        '¡Éxito!',
        'Tu orden ha sido creada y pagada.'
      );
      this.cartService.clear();
      this.router.navigate(['/orders', orderResponse.data.id]);
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      this.notificationService.error(
        'Error en el pago',
        error?.error?.message || 'No se pudo procesar tu pago.'
      );
    }
  }

  handleStep2Data(data: CheckoutStep2Data) {
    this.selectedDeliveryAddress = null;
    this.selectedTableId = null;

    if (data.deliveryAddress) {
      this.selectedDeliveryAddress = data.deliveryAddress;
    }
    if (data.dineIn) {
      this.selectedTableId = data.dineIn.tableId;
    }

    console.log('Data del paso 2 recibida:', data);
    this.goToStep(2);
  }

  isDelivery = (): boolean => this.selectedOrderType?.code === 'DELIVERY';
  isDineIn = (): boolean => this.selectedOrderType?.code === 'DINE_IN';
}
