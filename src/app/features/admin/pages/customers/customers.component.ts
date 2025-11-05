import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CustomerResponse } from '../../../../core/models/customer/customer.model';
import { CustomerService } from '../../../../core/services/customer/customerhttp/customer.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-customers',
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    TagModule,
    AvatarModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  customers: CustomerResponse[] = [];
  loading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        this.customers = response.data.content || [];
        this.loading = false;
      },
      error: () => {
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los clientes'
        );
        this.loading = false;
      },
    });
  }

  createCustomer() {
    this.router.navigate(['/admin/customers/create']);
  }

  viewCustomer(id: number) {
    this.router.navigate(['/admin/customers', id]);
  }

  editCustomer(id: number) {
    this.router.navigate(['/admin/customers', id, 'edit']);
  }

  deleteCustomer(id: number) {
    if (!confirm('¿Deseas eliminar este cliente?')) return;
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        this.notificationService.success(
          'Eliminado',
          'Cliente eliminado correctamente'
        );
        this.loadCustomers();
      },
      error: () => {
        this.notificationService.error(
          'Error',
          'No se pudo eliminar el cliente'
        );
      },
    });
  }
}
