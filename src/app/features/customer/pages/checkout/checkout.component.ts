import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepperModule } from 'primeng/stepper';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AddressCustomerRequest,
  AddressResponse,
} from '../../../../core/models/address.model';
import { CartItem } from '../../../../core/models/cart.model';
import { OrderTypeResponse } from '../../../../core/models/order-type.model';
import { CartService } from '../../../../core/services/cart.service';
import { AddressService } from '../../../../core/services/customer/address/address.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderTypeService } from '../../../../core/services/orders/order-type.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { PaymentService } from '../../../../core/services/payment.service';
import { AddressFormComponent } from './components/address-form/address-form.component';
import {
  MercadoPagoCardToken,
  PaymentBrickComponent,
} from './components/payment-brick/payment-brick.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepperModule,
    ButtonModule,
    RadioButtonModule,
    AutoCompleteModule,
    InputTextModule,
    AddressFormComponent,
    PaymentBrickComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  mercadoPagoPublicKey = environment.mercadoPagoPublicKey;
  cardTokenData: any = null;

  orderTypes: OrderTypeResponse[] = [];
  selectedOrderType: OrderTypeResponse | null = null;

  addresses: AddressResponse[] = [];
  selectedAddressId: number | null = null;

  showAddressForm = false;

  total = 0;
  storeSelected: any;
  stores = [
    { id: 1, name: 'Tienda Central - Av. Principal 123' },
    { id: 2, name: 'Sucursal Norte - Jr. Comercio 456' },
  ];

  agencySelected: any;
  agencies = [
    { id: 1, name: 'Agencia Olva - Av. Los Olivos 789' },
    { id: 2, name: 'Locker Mall Aventura' },
  ];
  filteredStores: any[] = [];
  filteredAgencies: any[] = [];

  activeStepIndex: number = 0;

  shippingOption: string = 'standard';
  paymentMethod: string = 'card';
  card = {
    number: '',
    expiration: '',
    cvv: '',
    holder: '',
    doc: '',
  };

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private orderTypeService: OrderTypeService,
    private addressService: AddressService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });

    this.loadOrderTypes();

    this.loadAddresses();
  }

  nextStep() {
    if (this.activeStepIndex < 2) this.activeStepIndex++;
  }

  previousStep() {
    if (this.activeStepIndex > 0) this.activeStepIndex--;
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
        console.error('Error cargando tipos de orden', err);
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los tipos de orden'
        );
      },
    });
  }

  loadAddresses() {
    this.addressService.getAllAddressAuth().subscribe({
      next: (res) => {
        this.addresses = res.data.content;
      },
      error: () => {
        this.notificationService.error(
          'Error',
          'No se pudieron cargar las direcciones'
        );
      },
    });
  }

  saveAddress(addr: AddressCustomerRequest) {
    this.addressService.addAddressAuth(addr).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.success('Dirección guardada');
          this.addresses.push(res.data);
          this.selectedAddressId = res.data.id;
          this.showAddressForm = false;
        }
      },
      error: () => {
        this.notificationService.error(
          'Error',
          'No se pudo guardar la dirección'
        );
      },
    });
  }

  addNewAddress() {
    this.showAddressForm = true;
  }

  deleteAddress(addressId: number) {
    this.addressService.deleteAddress(addressId).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.success('Dirección eliminada');
          this.addresses = this.addresses.filter(
            (address) => address.id !== addressId
          );
        }
      },
      error: (err) => {
        this.notificationService.error('No se pudo eliminar la dirección');
      },
    });
  }

  async handleBrickToken(tokenData: MercadoPagoCardToken) {
    try {
      console.log(tokenData);
      this.cardTokenData = tokenData;

      const order = await this.orderService.createOrderAsync({
        statusId: 1,
        typeId: this.selectedOrderType?.id!,
        addressId: this.selectedAddressId || 1,
        details: this.items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      });

      const payer = tokenData.payer;
      await firstValueFrom(
        this.paymentService.createOnlinePayment({
          orderId: order.data.id,
          transactionAmount: tokenData.transaction_amount,
          installments: tokenData.installments,
          token: tokenData.token,
          email: payer.email,
          docType: payer.identification.type,
          docNumber: payer.identification.number,
          paymentMethodId: tokenData.payment_method_id,
        })
      );

      this.notificationService.success('Orden creada y pagada exitosamente');
      this.cartService.clear();
      this.goToStep(0);
      this.router.navigate(['/orders', order.data.id]);
    } catch (error: any) {
      console.error('Error al procesar pago con Brick:', error);
      this.notificationService.error(
        error?.error?.message || 'Error al procesar el pago'
      );
    }
  }

  isDelivery(): boolean {
    return this.selectedOrderType?.code === 'DELIVERY';
  }

  isTakeAway(): boolean {
    return this.selectedOrderType?.code === 'TAKE_AWAY';
  }

  isDineIn(): boolean {
    return this.selectedOrderType?.code === 'DINE_IN';
  }

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

  searchStores(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredStores = this.stores.filter((store) =>
      store.name.toLowerCase().includes(query)
    );
  }

  searchAgencies(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredAgencies = this.agencies.filter((agency) =>
      agency.name.toLowerCase().includes(query)
    );
  }

  onCardToken(cardFormData: any) {
    this.cardTokenData = cardFormData;
    console.log('Token recibido del Brick:', cardFormData);
  }

  onPaymentBrickReady() {
    console.log('Payment Brick listo');
  }

  onPaymentBrickError(err: any) {
    console.error('Error en Payment Brick:', err);
  }
}
