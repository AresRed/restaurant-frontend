import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SupplierRequest } from '../../../../../core/models/supplier.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { PasswordModule } from 'primeng/password';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-supplier',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
  ],
  templateUrl: './form-supplier.component.html',
  styleUrl: './form-supplier.component.scss',
})
export class FormSupplierComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: number | null = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],

      companyName: ['', Validators.required],
      contactName: ['', Validators.required],
      phone: [''],
      address: [''],
    });

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = +paramId;

      this.form.get('password')?.clearValidators();
      this.form.get('password')?.disable();

      this.loadSupplier();
    } else {
      this.isEdit = false;
    }
  }

  loadSupplier() {
    if (!this.id) return;
    this.isLoading = true;
    this.supplierService.getSupplierById(this.id).subscribe((res) => {
      if (res.success) {
        // 3. Llenar el formulario con patchValue
        this.form.patchValue({
          username: res.data.username,
          email: res.data.email,
          companyName: res.data.companyName,
          contactName: res.data.contactName,
          phone: res.data.phone,
          address: res.data.address,
        });
      }
      this.isLoading = false;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.form.getRawValue();

    const request: SupplierRequest = {
      username: formValue.username,
      email: formValue.email,
      companyName: formValue.companyName,
      contactName: formValue.contactName,
      phone: formValue.phone,
      address: formValue.address,
    };

    if (!this.isEdit) {
      request.password = formValue.password;
    }

    const obs = this.isEdit
      ? this.supplierService.editSupplier(this.id!, request)
      : this.supplierService.addSupplier(request);

    obs.subscribe({
      next: () => {
        this.notificationService.success(
          'Éxito',
          this.isEdit
            ? 'Proveedor actualizado correctamente'
            : 'Proveedor registrado correctamente'
        );
        this.isSaving = false;
        this.router.navigate(['/admin/suppliers']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar proveedor', err);
        let errorMsg = 'No se pudo guardar el proveedor.';

        if (err.error?.message) {
          errorMsg = err.error.message;
          if (err.error.data) {
            errorMsg = Object.values(err.error.data).join(', ');
          }
        }

        this.notificationService.error('Error', errorMsg);
        this.isSaving = false;
      },
    });
  }

  goToSuppliers() {
    this.router.navigate(['/admin/suppliers']);
  }
}
