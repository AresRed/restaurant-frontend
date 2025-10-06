import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AddStockRequest } from '../../../../../core/models/products/inventory/inventory.model';
import { SupplierResponse } from '../../../../../core/models/supplier.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InventoryService } from '../../../../../core/services/products/inventory/inventory.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    TextareaModule,
  ],
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],
})
export class AddStockComponent implements OnInit {
  addStockForm!: FormGroup;
  ingredientId!: number;
  suppliers: SupplierResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private inventoryService: InventoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.ingredientId = Number(this.route.snapshot.paramMap.get('id'));

    this.addStockForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      supplierId: [null],
      reason: ['', [Validators.required, Validators.minLength(5)]],
    });

    // Cargar proveedores
    this.supplierService.getAllSuppliers().subscribe({
      next: (res) => {
        if (res.success) this.suppliers = res.data;
      },
      error: (err: HttpErrorResponse) =>
        this.notificationService.error('Error', err.message),
    });
  }

  get formControls() {
    return this.addStockForm.controls;
  }

  onSubmit() {
    if (this.addStockForm.invalid) {
      this.addStockForm.markAllAsTouched();
      return;
    }

    const payload: AddStockRequest = {
      quantity: this.addStockForm.value.quantity,
      supplierId: this.addStockForm.value.supplierId,
      reason: this.addStockForm.value.reason,
    };

    this.inventoryService.addStock(this.ingredientId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.success(
            'Éxito',
            'Stock actualizado correctamente.'
          );
          this.router.navigate(['/admin/inventory']);
        }
      },
      error: (err) => {
        const message =
          err.error?.message || 'Ocurrió un error al actualizar el stock.';
        this.notificationService.error('Error', message);
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/inventory']);
  }
}
