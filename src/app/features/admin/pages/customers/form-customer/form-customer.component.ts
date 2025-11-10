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
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CustomerRequest } from '../../../../../core/models/customer/customer.model';
import { CustomerService } from '../../../../../core/services/customer/customerhttp/customer.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-form-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    PasswordModule,
  ],
  templateUrl: './form-customer.component.html',
  styleUrl: './form-customer.component.scss',
})
export class FormCustomerComponent implements OnInit {
  form!: FormGroup;
  editing = false;
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.editing = true;
      this.customerId = Number(idParam);

      this.form.get('username')?.disable();
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.disable();

      this.loadCustomer();
    } else {
      this.editing = false;
    }
  }

  loadCustomer() {
    this.customerService.getCustomerById(this.customerId!).subscribe({
      next: (res) => {
        this.form.patchValue({
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phone,
        });
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const request: CustomerRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
    };

    if (!this.editing) {
      request.username = formValue.username;
      request.password = formValue.password;
    }

    const obs = this.editing
      ? this.customerService.updateCustomer(this.customerId!, request)
      : this.customerService.createCustomer(request);

    obs.subscribe({
      next: () => {
        this.notificationService.success(
          'Éxito',
          this.editing ? 'Cliente actualizado' : 'Cliente creado'
        );
        this.router.navigate(['/admin/customers']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar cliente', err);
        let errorMsg = 'No se pudo guardar el cliente.';

        if (err.error?.message) {
          errorMsg = err.error.message;
          if (err.error.data) {
            errorMsg = Object.values(err.error.data).join(', ');
          }
        }

        this.notificationService.error('Error', errorMsg);
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/customers']);
  }
}
