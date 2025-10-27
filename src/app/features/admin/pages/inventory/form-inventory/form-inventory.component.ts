import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { IngredientResponse } from '../../../../../core/models/products/product/ingredient/ingredient.model';
import { IngredientService } from '../../../../../core/services/ingredient.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { InventoryService } from '../../../../../core/services/products/inventory/inventory.service';

@Component({
  selector: 'app-form-inventory',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    SelectModule,
  ],
  templateUrl: './form-inventory.component.html',
  styleUrl: './form-inventory.component.scss',
})
export class FormInventoryComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id!: number;

  ingredients: IngredientResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private ingredientService: IngredientService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      ingredientId: [null, Validators.required],
      ingredientName: [''],
      unitName: [''],
      unitSymbol: [''],
      minimumStock: [0, [Validators.required, Validators.min(0)]],
      currentStock: [0, [Validators.required, Validators.min(0)]],
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.id = +idParam;
        this.loadInventory();
      } else {
        this.loadIngredients();
      }
    });

    this.form.get('ingredientId')?.valueChanges.subscribe((id) => {
      if (id) {
        const selected = this.ingredients.find((i) => i.id === id);
        if (selected) {
          this.form.patchValue({
            ingredientName: selected.name,
            unitName: selected.unitName,
            unitSymbol: selected.unitSymbol,
          });
        }
      } else {
        this.form.patchValue({
          ingredientName: '',
          unitName: '',
          unitSymbol: '',
        });
      }
    });
  }

  loadIngredients() {
    this.ingredientService.getAllIngredients().subscribe({
      next: (res) => {
        if (res.success) {
          this.ingredients = res.data;
        }
      },
      error: (err) => this.notificationService.error('Error', err.message),
    });
  }

  loadInventory() {
    this.inventoryService.getInventoryById(this.id).subscribe({
      next: (res) => {
        if (res.success) {
          const inventory = res.data.inventory;

          this.ingredientService.getAllIngredients().subscribe({
            next: (ings) => {
              if (ings.success) this.ingredients = ings.data;

              this.form.patchValue({
                ingredientId: inventory.ingredientId,
                ingredientName: inventory.ingredientName,
                unitName: inventory.unitName,
                unitSymbol: inventory.unitSymbol,
                currentStock: inventory.currentStock,
                minimumStock: inventory.minimumStock,
              });

              this.form.get('ingredientId')?.disable();
              this.form.get('ingredientName')?.disable();
              this.form.get('unitName')?.disable();
              this.form.get('unitSymbol')?.disable();
            },
          });
        }
      },
      error: (err) => this.notificationService.error('Error', err.message),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.isEdit) {
      const formData = {
        currentStock: this.form.get('currentStock')?.value,
        minimumStock: this.form.get('minimumStock')?.value,
      };

      this.inventoryService.updateInventory(formData, this.id).subscribe({
        next: () => {
          this.notificationService.success(
            'Actualizado',
            'Inventario actualizado correctamente'
          );
          this.router.navigate(['/admin/inventory']);
        },
        error: (err) => this.notificationService.error('Error', err.message),
      });
    } else {
      const formData = {
        ingredientId: this.form.get('ingredientId')?.value,
        currentStock: this.form.get('currentStock')?.value,
        minimumStock: this.form.get('minimumStock')?.value,
      };

      this.inventoryService.addInventory(formData).subscribe({
        next: () => {
          this.notificationService.success(
            'Creado',
            'Inventario registrado correctamente'
          );
          this.router.navigate(['/admin/inventory']);
        },
        error: (err: HttpErrorResponse) => {
          const backendMessage =
            err.error?.message || 'Error al registrar el inventario';
          this.notificationService.error('Error', backendMessage);
        },
      });
    }
  }

  backToInventory() {
    this.router.navigate(['/admin/inventory']);
  }
}
