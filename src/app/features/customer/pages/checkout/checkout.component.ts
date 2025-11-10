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
import { OrderStatusResponse } from '../../../../core/models/order/order-statuses/order-statuses.model';
import {
  DeliveryAddressRequest,
  OrderRequest,
  PaymentInOrderRequest,
} from '../../../../core/models/order/orderhttp/order.model';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderStatusService } from '../../../../core/services/orders/order-status.service';
import { OrderTypeService } from '../../../../core/services/orders/order-type.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { PaymentService } from '../../../../core/services/payment/payment.service';
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

  private allOrderStatuses: OrderStatusResponse[] = [];
  private onlinePaymentStatusId?: number; // Para pagos con tarjeta (PENDING)
  private localPaymentStatusId?: number;

  selectedDeliveryAddress: DeliveryAddressRequest | null = null;
  selectedTableId: number | null = null;

  selectedPickupStoreId: number | null = null;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private orderStatusService: OrderStatusService,
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
    this.loadOrderStatuses();
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

  loadOrderStatuses(): void {
    this.orderStatusService.getAllOrderStatuses().subscribe({
      next: (res) => {
        if (!res.success || !res.data) {
          this.notificationService.error(
            'Error Crítico',
            'No se pudieron cargar los estados de orden.'
          );
          return;
        }
        this.allOrderStatuses = res.data;

        const pendingStatus = res.data.find((s) => s.code === 'PENDING');
        const pendingConfirmationStatus = res.data.find(
          (s) => s.code === 'PENDING_CONFIRMATION'
        );

        if (pendingStatus) {
          this.onlinePaymentStatusId = pendingStatus.id;
        } else {
          this.notificationService.error(
            'Error de Config.',
            'No se encontró el estado "PENDING".'
          );
        }

        if (pendingConfirmationStatus) {
          this.localPaymentStatusId = pendingConfirmationStatus.id;
        } else {
          this.notificationService.error(
            'Error de Config.',
            'No se encontró el estado "PENDING_CONFIRMATION".'
          );
        }
      },
      error: (err) =>
        this.notificationService.error(
          'Error de Red',
          'No se pudieron cargar los estados de orden.'
        ),
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
      if (this.isTakeAway() && !this.selectedPickupStoreId) {
        this.notificationService.error(
          'Error',
          'Por favor, selecciona una tienda para recoger.'
        );
        return;
      }

      if (!this.onlinePaymentStatusId) {
        this.notificationService.error(
          'Error de Configuración',
          'El estado "PENDING" no está cargado.'
        );
        return;
      }
      const orderPayload: OrderRequest = this.buildOrderPayload(
        this.onlinePaymentStatusId
      );

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

      this.showSuccessAndNavigate(
        orderResponse.data.id,
        'Tu orden ha sido creada y pagada.'
      );
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async handleLocalOrder(localPayment: PaymentInOrderRequest) {
    try {
      if (
        (this.isDelivery() && !this.selectedDeliveryAddress) ||
        (this.isDineIn() && !this.selectedTableId) ||
        (this.isTakeAway() && !this.selectedPickupStoreId)
      ) {
        this.notificationService.error(
          'Error',
          'Falta información del paso anterior.'
        );
        this.goToStep(1);
        return;
      }

      if (!this.localPaymentStatusId) {
        this.notificationService.error(
          'Error de Configuración',
          'El estado "PENDING_CONFIRMATION" no está cargado.'
        );
        return;
      }
      const orderPayload: OrderRequest = this.buildOrderPayload(
        this.localPaymentStatusId
      );

      orderPayload.payments = [localPayment];

      const orderResponse = await firstValueFrom(
        this.orderService.createOrder(orderPayload)
      );

      this.showSuccessAndNavigate(
        orderResponse.data.id,
        'Tu orden ha sido recibida. Un administrador la confirmará en breve.'
      );
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private buildOrderPayload(initialStatusId: number): OrderRequest {
    const orderPayload: OrderRequest = {
      statusId: initialStatusId,
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
    } else if (this.isTakeAway()) {
      orderPayload.pickupStoreId = this.selectedPickupStoreId!;
    }
    return orderPayload;
  }

  private showSuccessAndNavigate(orderId: number, message: string) {
    this.notificationService.success('¡Éxito!', message);
    this.cartService.clear();
    this.router.navigate(['/profile/orders', orderId]);
  }

  private handleError(error: any) {
    console.error('Error al procesar la orden:', error);
    // Aquí usamos el parche de seguridad del backend
    const errorMsg = error?.error?.message.includes(
      'Los pagos online no están permitidos'
    )
      ? 'Error de lógica: Intento de pago online para orden local.'
      : error?.error?.message;

    this.notificationService.error(
      'Error en la orden',
      errorMsg || 'No se pudo procesar tu orden.'
    );
  }

  handleStep2Data(data: CheckoutStep2Data) {
    this.selectedDeliveryAddress = null;
    this.selectedTableId = null;
    this.selectedPickupStoreId = null;

    if (data.deliveryAddress) {
      this.selectedDeliveryAddress = data.deliveryAddress;
    }
    if (data.dineIn) {
      this.selectedTableId = data.dineIn.tableId;
    }
    if (data.takeAway) {
      this.selectedPickupStoreId = data.takeAway.storeId;
    }

    console.log('Data del paso 2 recibida:', data);
    this.goToStep(2);
  }

  isDelivery = (): boolean => this.selectedOrderType?.code === 'DELIVERY';
  isDineIn = (): boolean => this.selectedOrderType?.code === 'DINE_IN';
  isTakeAway = (): boolean => this.selectedOrderType?.code === 'TAKE_AWAY';
}
