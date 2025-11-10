import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CustomerResponse } from '../../../../core/models/customer/customer.model';
import { PaymentMethodResponse } from '../../../../core/models/payment/payment-method.model';
import { PaymentResponse } from '../../../../core/models/payment/payment.model';
import { CustomerService } from '../../../../core/services/customer/customerhttp/customer.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { PaymentMethodService } from '../../../../core/services/payment/payment-methods.service';
import {
  PaymentFilters,
  PaymentService,
} from '../../../../core/services/payment/payment.service';

type TagSeverity =
  | 'info'
  | 'success'
  | 'danger'
  | 'warn'
  | 'secondary'
  | 'contrast';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
  ],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.scss',
})
export class PaymentHistoryComponent implements OnInit {
  isLoading = signal(false);

  payments = signal<PaymentResponse[]>([]);
  customers = signal<CustomerResponse[]>([]);
  paymentMethods = signal<PaymentMethodResponse[]>([]);

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private paymentMethodService: PaymentMethodService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      dates: [null],
      customer: [null],
      paymentMethod: [null],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadPayments();
  }

  loadInitialData(): void {
    this.paymentMethodService.getAllPaymentMethods().subscribe({
      next: (res) => this.paymentMethods.set(res.data),
      error: () =>
        this.notificationService.error(
          'Error',
          'No se cargaron métodos de pago.'
        ),
    });
  }

  searchCustomer(event: AutoCompleteCompleteEvent): void {
    this.customerService.searchCustomers(event.query).subscribe({
      next: (res) => this.customers.set(res.data),
    });
  }

  onSearch(): void {
    this.loadPayments();
  }

  onReset(): void {
    this.filterForm.reset();
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading.set(true);

    const form = this.filterForm.value;
    const dates = form.dates as Date[] | null;

    const filters: PaymentFilters = {
      customerId: (form.customer as CustomerResponse | null)?.id,
      paymentMethodId: (form.paymentMethod as PaymentMethodResponse | null)?.id,
      dateFrom: dates?.[0] ? dates[0].toISOString() : undefined,
      dateTo: dates?.[1] ? dates[1].toISOString() : undefined,
    };

    this.paymentService.getPayments(filters).subscribe({
      next: (response) => {
        if (response.success) {
          this.payments.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          err.error?.message || 'No se pudo cargar el historial de pagos.'
        );
        this.isLoading.set(false);
      },
    });
  }

  onDownloadInvoice(orderId: number) {
    this.notificationService.info('Preparando descarga', 'Generando PDF...');

    this.orderService.downloadInvoice(orderId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Comprobante-Orden-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudo generar el comprobante.'
        );
        console.error(err);
      },
    });
  }

  getStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'FAILED':
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
