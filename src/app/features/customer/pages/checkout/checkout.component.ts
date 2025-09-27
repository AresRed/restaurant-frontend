import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepperModule } from 'primeng/stepper';
import { CartItem } from '../../../../core/models/cart.model';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PaymentService } from '../../../../core/services/payment.service';

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
    InputText,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
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
  address = {
    store: '',
    agency: '',
    street: '',
    city: '',
    province: '',
    zip: '',
    reference: '',
    receiver: '',
    phone: '',
    document: '',
  };

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await loadMercadoPago();

    this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
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

  async pay() {
    try {
      const orderId = 123; // TODO: obtener dinámicamente de tu backend

      const response = await this.paymentService.payWithCard(
        orderId,
        this.card
      );

      console.log('Pago exitoso:', response);
      this.notificationService.success('Pago exitoso');
      this.cartService.clear();
      this.goToStep(0);
    } catch (error: any) {
      console.error('Error al pagar:', error);
      this.notificationService.error(
        error?.cause?.[0]?.description || 'Error al procesar el pago'
      );
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
}
