import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../../environments/environment';
import { CustomerResponse } from '../../../../core/models/customer/customer.model';
import { OrderTypeResponse } from '../../../../core/models/order-type.model';
import { OrderStatusResponse } from '../../../../core/models/order/order-statuses/order-statuses.model';
import {
  DocumentInOrderRequest,
  OrderDetailRequest,
  OrderRequest,
  PaymentInOrderRequest,
} from '../../../../core/models/order/orderhttp/order.model';
import { PaymentMethodResponse } from '../../../../core/models/payment/payment-method.model';
import { ProductResponse } from '../../../../core/models/products/product/product.model';
import { TableResponse } from '../../../../core/models/table.model';
import { CustomerService } from '../../../../core/services/customer/customerhttp/customer.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { OrderStatusService } from '../../../../core/services/orders/order-status.service';
import { OrderTypeService } from '../../../../core/services/orders/order-type.service';
import { OrderService } from '../../../../core/services/orders/order.service';
import { PaymentMethodService } from '../../../../core/services/payment/payment-methods.service';
import { ProductService } from '../../../../core/services/products/product/product.service';
import { TableService } from '../../../../core/services/restaurant/table.service';

interface CartItem extends OrderDetailRequest {
  name: string;
  price: number;
  lineTotal: number;
}

interface AddedPayment {
  paymentMethodName: string;
  paymentMethodId: number;
  amount: number;
  transactionCode?: string | null;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    ToastModule,
    ButtonModule,
    ProgressSpinnerModule,
    TagModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    DataViewModule,
    DialogModule,
    AutoCompleteModule,
    DropdownModule,
    BadgeModule,
    PaginatorModule,
    TooltipModule,
    CheckboxModule,
    ToggleButtonModule,
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
})
export class PosComponent implements OnInit {
  readonly TAX_RATE = environment.igv;
  readonly DEFAULT_CUSTOMER_ID = 1;
  readonly DEFAULT_ORDER_TYPE_CODE = 'TAKE_AWAY';
  readonly CURRENT_STORE_ID = 1;

  private initialStatusMap = new Map<string, number>();

  // --- Estado de Carga y UI ---
  isLoadingProducts = signal(false);
  isSubmittingOrder = signal(false);
  displayPaymentModal = signal(false);

  products = signal<ProductResponse[]>([]);
  paymentMethods = signal<PaymentMethodResponse[]>([]);
  orderTypes = signal<OrderTypeResponse[]>([]);
  tables = signal<TableResponse[]>([]);

  selectedCustomer = signal<CustomerResponse | null>(null);
  filteredCustomers = signal<CustomerResponse[]>([]);
  selectedOrderType = signal<OrderTypeResponse | null>(null);
  selectedTable = signal<TableResponse | null>(null);

  currentPage = 0;
  rowsPerPage = 12;
  paginatedProducts: ProductResponse[] = [];

  productSearchQuery = signal<string>('');

  filteredProducts = computed(() => {
    const query = this.productSearchQuery().toLowerCase();
    if (query === '') {
      return this.products();
    }
    return this.products().filter((p) => p.name.toLowerCase().includes(query));
  });

  cart = signal<CartItem[]>([]);
  subtotal = computed(() =>
    this.cart().reduce((acc, item) => acc + item.lineTotal, 0)
  );
  taxes = computed(() => this.subtotal() * this.TAX_RATE);
  total = computed(() => this.subtotal() + this.taxes());

  paymentForm: FormGroup;
  documentForm: FormGroup;

  addedPayments = signal<AddedPayment[]>([]);
  totalPaid = computed(() =>
    this.addedPayments().reduce((acc, p) => acc + p.amount, 0)
  );
  wantsDocument = signal(false);
  documentTypes = signal<{ label: string; value: string }[]>([
    { label: 'DNI', value: 'DNI' },
    { label: 'RUC', value: 'RUC' },
  ]);
  amountRemaining = computed(() => this.total() - this.totalPaid());

  orderStatusTypes = signal<OrderStatusResponse[]>([]);

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private paymentMethodService: PaymentMethodService,
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private orderTypeService: OrderTypeService,
    private tableService: TableService,
    private route: ActivatedRoute,
    private orderStatusService: OrderStatusService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      transactionCode: [null],
    });

    this.documentForm = this.fb.group({
      type: ['DNI', [Validators.required]],
      number: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(11),
        ],
      ],
    });

    effect(() => {
      this.updatePagination();
    });

    effect(() => {
      const wants = this.wantsDocument();
      const numberControl = this.documentForm.get('number');
      if (wants) {
        numberControl?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(11),
        ]);
      } else {
        numberControl?.clearValidators();
      }
      numberControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    const tableIdFromRoute = this.route.snapshot.paramMap.get('tableId');
    if (tableIdFromRoute) {
      this.preloadTableData(+tableIdFromRoute);
    }
  }

  loadInitialData(): void {
    this.loadProducts();
    this.loadPaymentMethods();
    this.loadOrderTypes();
    this.loadOrderStatuses();
    this.setDefaultCustomer();
    this.loadTables();
  }

  // --- Manejo de UI y Paginación ---

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.updatePagination();
  }

  updatePagination() {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedProducts = this.filteredProducts().slice(start, end);
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.productSearchQuery.set(query);
  }

  // --- Carga de Datos ---

  loadProducts(): void {
    this.isLoadingProducts.set(true);
    this.productService.getAllActive().subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.isLoadingProducts.set(false);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los productos.'
        );
        this.isLoadingProducts.set(false);
      },
    });
  }

  loadOrderStatuses(): void {
    this.orderStatusService.getAllOrderStatuses().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.orderStatusTypes.set(res.data);
          const pendingStatus = res.data.find(
            (s) => s.code === 'PENDING_CONFIRMATION'
          );
          const paidStatus = res.data.find((s) => s.code === 'COMPLETED');

          if (pendingStatus) {
            this.initialStatusMap.set('DINE_IN', pendingStatus.id);
            this.initialStatusMap.set('TAKE_AWAY', pendingStatus.id);
            this.initialStatusMap.set('DELIVERY', pendingStatus.id);
          }
          if (paidStatus) {
          }
        } else {
          this.notificationService.error(
            'Error Crítico',
            'No se pudieron cargar los estados de orden.'
          );
        }
      },
      error: (err) => {
        this.notificationService.error(
          'Error Crítico',
          'No se pudieron cargar los estados de orden.'
        );
      },
    });
  }

  loadPaymentMethods(): void {
    this.paymentMethodService.getAllPaymentMethods().subscribe({
      next: (response) => this.paymentMethods.set(response.data),
      error: (err) =>
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los métodos de pago.'
        ),
    });
  }

  loadOrderTypes(): void {
    this.orderTypeService.getAllOrderTypes().subscribe({
      next: (response) => {
        const types = response.data;
        this.orderTypes.set(types);
        const defaultType = types.find(
          (t) => t.code === this.DEFAULT_ORDER_TYPE_CODE
        );
        if (defaultType) {
          this.selectedOrderType.set(defaultType);
        }
      },
      error: (err) =>
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los tipos de orden.'
        ),
    });
  }

  setDefaultCustomer(): void {
    this.customerService.getCustomerById(this.DEFAULT_CUSTOMER_ID).subscribe({
      next: (response) => {
        this.selectedCustomer.set(response.data);
      },
      error: (err) =>
        this.notificationService.error(
          'Error',
          'No se pudo cargar el cliente por defecto.'
        ),
    });
  }

  /**
   * Precarga una mesa y el tipo de orden "Dine-In"
   * cuando se navega desde la vista de mesas.
   */
  preloadTableData(tableId: number): void {
    this.tableService.getTableById(tableId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.selectedTable.set(res.data);

          const dineInType = this.orderTypes().find(
            (t) => t.code === 'DINE_IN'
          );
          if (dineInType) {
            this.selectedOrderType.set(dineInType);
          } else {
            setTimeout(() => {
              const dineInTypeRetry = this.orderTypes().find(
                (t) => t.code === 'DINE_IN'
              );
              if (dineInTypeRetry) {
                this.selectedOrderType.set(dineInTypeRetry);
              } else {
                this.notificationService.warn(
                  'Error de Carga',
                  'No se encontró el tipo de orden "DINE_IN".'
                );
              }
            }, 1000); // Espera 1s a que carguen los tipos de orden
          }
        } else {
          this.notificationService.error(
            'Error',
            `No se pudo encontrar la mesa con ID ${tableId}.`
          );
        }
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error(
          'Error de Red',
          'No se pudo cargar la mesa seleccionada.'
        );
      },
    });
  }

  loadTables(): void {
    this.tableService.getAllTables().subscribe({
      next: (res) => {
        const freeTables = res.data.filter((t) => t.status === 'FREE');

        const currentTable = this.selectedTable();
        if (currentTable && !freeTables.some((t) => t.id === currentTable.id)) {
          this.tables.set([currentTable, ...freeTables]);
        } else {
          this.tables.set(freeTables);
        }
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudieron cargar las mesas.'
        );
      },
    });
  }

  searchCustomer(event: AutoCompleteCompleteEvent): void {
    this.customerService.searchCustomers(event.query).subscribe({
      next: (res) => {
        this.filteredCustomers.set(res.data);
      },
      error: () => {
        this.notificationService.error('Error', 'No se pudo buscar clientes.');
      },
    });
  }

  onCustomerSelect(event: any): void {
    this.selectedCustomer.set(event.value as CustomerResponse);
  }

  // --- Lógica del Carrito ---

  addToCart(product: ProductResponse): void {
    if (!product.active) {
      this.notificationService.warn(
        'Producto Inactivo',
        'Este producto esta deshabilitado'
      );
      return;
    }

    this.cart.update((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        return currentCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: newQuantity,
                lineTotal: newQuantity * item.price,
              }
            : item
        );
      } else {
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          lineTotal: product.price,
        };
        return [...currentCart, newItem];
      }
    });
  }

  updateCartItem(item: CartItem, event: any): void {
    const newQuantity = event.value;
    if (newQuantity < 1) {
      this.removeFromCart(item.productId);
      return;
    }
    item.quantity = newQuantity;
    item.lineTotal = item.price * newQuantity;

    this.cart.update((currentCart) => [...currentCart]);
  }

  removeFromCart(productId: number): void {
    this.cart.update((currentCart) =>
      currentCart.filter((item) => item.productId !== productId)
    );
  }

  resetAll(): void {
    this.cart.set([]);
    this.setDefaultCustomer();
    this.loadOrderTypes();
    this.resetPaymentModal();
    this.selectedTable.set(null);
  }

  // --- Lógica de Pago ---

  openPaymentModal(): void {
    if (!this.selectedCustomer() || !this.selectedOrderType()) {
      this.notificationService.warn(
        'Datos Faltantes',
        'Por favor, seleccione un cliente y un tipo de orden.'
      );
      return;
    }

    if (this.selectedOrderType()?.code === 'DINE_IN' && !this.selectedTable()) {
      this.notificationService.warn(
        'Datos Faltantes',
        'Por favor, seleccione una mesa.'
      );
      return;
    }

    this.paymentForm.reset();
    this.paymentForm.get('amount')?.setValue(this.amountRemaining());

    this.wantsDocument.set(false);
    this.documentForm.reset({ type: 'DNI' });

    this.displayPaymentModal.set(true);
  }

  resetPaymentModal(): void {
    this.addedPayments.set([]);
    this.paymentForm.reset();

    this.wantsDocument.set(false);
    this.documentForm.reset({ type: 'DNI' });
  }

  addPayment(): void {
    if (this.paymentForm.invalid) return;

    const formValue = this.paymentForm.value;
    const paymentMethod: PaymentMethodResponse = formValue.paymentMethod;
    const amount: number = formValue.amount;

    if (amount <= 0) {
      this.notificationService.warn(
        'Monto inválido',
        'Ingrese un monto mayor a 0.'
      );
      return;
    }

    const currentTotal = this.addedPayments().reduce(
      (acc, p) => acc + p.amount,
      0
    );
    const remaining = this.total() - currentTotal;

    if (amount > remaining) {
      this.notificationService.warn(
        'Monto excedido',
        `El monto ingresado excede el total restante de ${remaining.toFixed(
          2
        )}.`
      );
      return;
    }

    const alreadyExists = this.addedPayments().some(
      (p) => p.paymentMethodId === paymentMethod.id
    );
    if (alreadyExists) {
      this.notificationService.warn(
        'Método duplicado',
        'Ya se ha añadido este método de pago.'
      );
      return;
    }

    this.addedPayments.update((currentPayments) => [
      ...currentPayments,
      {
        paymentMethodName: paymentMethod.name,
        paymentMethodId: paymentMethod.id,
        amount: amount,
        transactionCode: formValue.transactionCode || null,
      },
    ]);

    this.paymentForm.reset();

    const newRemaining = this.amountRemaining();
    if (newRemaining > 0) {
      this.paymentForm.get('amount')?.setValue(newRemaining);
    }
  }

  removePayment(index: number): void {
    this.addedPayments.update((currentPayments) =>
      currentPayments.filter((_, i) => i !== index)
    );
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.productId;
  }

  submitOrder(): void {
    if (this.amountRemaining() > 0) {
      this.notificationService.warn(
        'Pago Incompleto',
        'El monto pagado es menor al total.'
      );
      return;
    }
    if (!this.selectedCustomer() || !this.selectedOrderType()) {
      return;
    }

    const orderDocuments: DocumentInOrderRequest[] = [];

    if (this.wantsDocument()) {
      if (this.documentForm.invalid) {
        this.notificationService.warn(
          'Datos Faltantes',
          'Por favor, ingrese un número de documento válido (DNI/RUC).'
        );
        return;
      }

      const docValue = this.documentForm.value;
      orderDocuments.push({
        type: docValue.type,
        number: docValue.number,
        amount: this.total(),
        date: new Date().toISOString(),
      });
    }

    this.isSubmittingOrder.set(true);

    const orderTypeCode = this.selectedOrderType()!.code;
    const initialStatusId = this.initialStatusMap.get(orderTypeCode);

    if (!initialStatusId) {
      this.notificationService.error(
        'Error de Configuración',
        `No se ha definido un estado inicial para el tipo de orden "${orderTypeCode}".`
      );
      this.isSubmittingOrder.set(false);
      return;
    }

    const orderDetails: OrderDetailRequest[] = this.cart().map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const orderPayments: PaymentInOrderRequest[] = this.addedPayments().map(
      (p) => ({
        paymentMethodId: p.paymentMethodId,
        amount: p.amount,
        isOnline: false,
        transactionCode: p.transactionCode || undefined,
        status: 'CONFIRMED',
      })
    );

    const orderRequest: OrderRequest = {
      customerId: this.selectedCustomer()!.id,
      typeId: this.selectedOrderType()!.id,
      statusId: initialStatusId,
      details: orderDetails,
      payments: orderPayments,
      documents: orderDocuments,
    };

    if (orderTypeCode === 'DINE_IN') {
      if (!this.selectedTable()) {
        this.notificationService.warn(
          'Error',
          'Seleccione una mesa para "Para Aquí".'
        );
        this.isSubmittingOrder.set(false);
        return;
      }
      orderRequest.tableId = this.selectedTable()!.id;
    } else if (orderTypeCode === 'TAKE_AWAY') {
      orderRequest.pickupStoreId = this.CURRENT_STORE_ID;
    }

    this.orderService.createPosSale(orderRequest).subscribe({
      next: (res) => {
        this.notificationService.success(
          'Venta Registrada',
          `Orden #${res.data.id} creada como "${res.data.statusName}".`
        );
        this.isSubmittingOrder.set(false);
        this.displayPaymentModal.set(false);
        this.resetAll();
        this.loadTables();
      },
      error: (err: any) => {
        console.error('Error al crear venta:', err);
        this.notificationService.error(
          'Error',
          err.error?.message || 'No se pudo registrar la venta.'
        );
        this.isSubmittingOrder.set(false);
      },
    });
  }
}
