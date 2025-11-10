import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { CategoryResponse } from '../../../../../core/models/category.model';
import { ProductResponse } from '../../../../../core/models/products/product/product.model';
import {
  CreatePromotionRequest,
  PromotionResponse,
  UpdatePromotionRequest,
} from '../../../../../core/models/products/promotions/promotion.model';
import { CategoryService } from '../../../../../core/services/category.service';
import {
  ConfirmOptions,
  ConfirmService,
} from '../../../../../core/services/confirmation.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ProductService } from '../../../../../core/services/products/product/product.service';
import { PromotionService } from '../../../../../core/services/products/promotions/promotion.service';

@Component({
  selector: 'app-promotion-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    InputSwitchModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
  ],
  templateUrl: './promotion-management.component.html',
  styleUrl: './promotion-management.component.scss',
})
export class PromotionManagementComponent implements OnInit {
  isLoading = signal(false);
  isSubmitting = signal(false);

  promotions = signal<PromotionResponse[]>([]);
  products = signal<ProductResponse[]>([]);
  categories = signal<CategoryResponse[]>([]);

  displayModal = signal(false);
  isEditMode = signal(false);
  currentPromotionId = signal<number | null>(null);
  promotionForm: FormGroup;

  discountTypes = [
    { label: 'Porcentaje (%)', value: 'PERCENTAGE' },
    { label: 'Monto Fijo (S/)', value: 'FIXED_AMOUNT' },
  ];

  constructor(
    private fb: FormBuilder,
    private promotionService: PromotionService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmService
  ) {
    this.promotionForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      active: [true, Validators.required],
      discountType: [null, Validators.required],
      discountValue: [null, [Validators.required, Validators.min(0.01)]],
      applicableProducts: [[]],
      applicableCategories: [[]],
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading.set(true);

    Promise.all([
      this.loadPromotions(),
      this.loadProducts(),
      this.loadCategories(),
    ]).finally(() => {
      this.isLoading.set(false);
    });
  }

  loadPromotions(): Promise<void> {
    return new Promise((resolve) => {
      this.promotionService.getAllPromotions().subscribe({
        next: (res) => {
          this.promotions.set(res.data);
          resolve();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se cargaron las promociones.'
          );
          resolve();
        },
      });
    });
  }

  loadProducts(): Promise<void> {
    return new Promise((resolve) => {
      this.productService.getAllActive().subscribe({
        next: (res) => {
          this.products.set(res.data);
          resolve();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se cargaron los productos.'
          );
          resolve();
        },
      });
    });
  }

  loadCategories(): Promise<void> {
    return new Promise((resolve) => {
      this.categoryService.getAllCategories().subscribe({
        next: (res) => {
          this.categories.set(res.data);
          resolve();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            'No se cargaron las categorías.'
          );
          resolve();
        },
      });
    });
  }

  openNewModal(): void {
    this.isEditMode.set(false);
    this.currentPromotionId.set(null);
    this.promotionForm.reset({ active: true });
    this.displayModal.set(true);
  }

  openEditModal(promotion: PromotionResponse): void {
    this.isEditMode.set(true);
    this.currentPromotionId.set(promotion.id);

    const productIds = promotion.applicableProducts.map((p) => p.id);
    const categoryIds = promotion.applicableCategories.map((c) => c.id);

    this.promotionForm.patchValue({
      ...promotion,
      startDate: new Date(promotion.startDate),
      endDate: new Date(promotion.endDate),
      applicableProducts: this.products().filter((p) =>
        productIds.includes(p.id)
      ),
      applicableCategories: this.categories().filter((c) =>
        categoryIds.includes(c.id)
      ),
    });
    this.displayModal.set(true);
  }

  hideModal(): void {
    this.displayModal.set(false);
  }

  onSave(): void {
    if (this.promotionForm.invalid) {
      this.notificationService.warn(
        'Datos incompletos',
        'Revise los campos del formulario.'
      );
      return;
    }
    this.isSubmitting.set(true);

    const formValue = this.promotionForm.value;

    const baseRequest = {
      ...formValue,
      startDate: (formValue.startDate as Date).toISOString(),
      endDate: (formValue.endDate as Date).toISOString(),
      applicableProductIds: (
        formValue.applicableProducts as ProductResponse[]
      ).map((p) => p.id),
      applicableCategoryIds: (
        formValue.applicableCategories as CategoryResponse[]
      ).map((c) => c.id),
    };

    delete (baseRequest as any).applicableProducts;
    delete (baseRequest as any).applicableCategories;

    if (this.isEditMode() && this.currentPromotionId()) {
      const request: UpdatePromotionRequest = baseRequest;

      this.promotionService
        .updatePromotion(this.currentPromotionId()!, request)
        .subscribe({
          next: () => {
            this.notificationService.success('Éxito', 'Promoción actualizada.');
            this.hideModal();
            this.loadPromotions();
            this.isSubmitting.set(false);
          },
          error: (err) => {
            this.notificationService.error(
              'Error',
              err.error?.message || 'No se pudo actualizar la promoción.'
            );
            this.isSubmitting.set(false);
          },
        });
    } else {
      const request: CreatePromotionRequest = baseRequest;

      this.promotionService.createPromotion(request).subscribe({
        next: () => {
          this.notificationService.success('Éxito', 'Promoción creada.');
          this.hideModal();
          this.loadPromotions();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            err.error?.message || 'No se pudo crear la promoción.'
          );
          this.isSubmitting.set(false);
        },
      });
    }
  }

  async onDelete(promotion: PromotionResponse, event: Event): Promise<void> {
    const options: ConfirmOptions = {
      message: `¿Está seguro de que desea eliminar la promoción "${promotion.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClass: 'p-button-danger',
      rejectClass: 'p-button-text',
      target: event.currentTarget as EventTarget,
    };

    const confirmed = await this.confirmationService.confirm(options);

    if (confirmed) {
      this.isLoading.set(true);

      this.promotionService.deletePromotion(promotion.id).subscribe({
        next: () => {
          this.notificationService.success('Éxito', 'Promoción eliminada.');
          this.loadPromotions().finally(() => {
            this.isLoading.set(false);
          });
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            err.error?.message || 'No se pudo eliminar.'
          );
          this.isLoading.set(false);
        },
      });
    }
  }
}
