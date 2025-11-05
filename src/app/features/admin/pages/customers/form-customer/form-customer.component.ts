import { CommonModule } from '@angular/common';
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
  ],
  templateUrl: './form-customer.component.html',
  styleUrl: './form-customer.component.scss',
})
export class FormCustomerComponent implements OnInit {
  form!: FormGroup;
  editing = false;
  customerId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      points: [0],
    });

    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.editing = !!this.customerId;

    if (this.editing) this.loadCustomer();
  }

  loadCustomer() {
    this.customerService.getCustomerById(this.customerId!).subscribe({
      next: (res) => this.form.patchValue(res.data),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const request: CustomerRequest = {
      userId: this.customerId ?? 0,
      ...this.form.value,
    };

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
      error: () => {
        this.notificationService.error(
          'Error',
          'No se pudo guardar el cliente'
        );
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/customers']);
  }
}
