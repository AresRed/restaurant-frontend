import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SupplierRequest } from '../../../../../core/models/supplier.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-form-supplier',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './form-supplier.component.html',
  styleUrl: './form-supplier.component.scss',
})
export class FormSupplierComponent implements OnInit {
  supplier: SupplierRequest = {
    companyName: '',
    contactName: '',
    phone: '',
    address: '',
  };

  isEdit = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = +paramId;
      this.loadSupplier();
    }
  }

  loadSupplier() {
    this.supplierService.getSupplierById(this.id).subscribe((res) => {
      if (res.success) this.supplier = res.data;
    });
  }

  saveSupplier() {
    if (this.isEdit) {
      this.supplierService.editSupplier(this.id, this.supplier).subscribe({
        next: () => {
          this.notificationService.success(
            'Actualizado',
            'Proveedor actualizado correctamente'
          );
          this.router.navigate(['/admin/suppliers']);
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            err.error?.message || 'No se pudo actualizar el proveedor'
          );
        },
      });
    } else {
      this.supplierService.addSupplier(this.supplier).subscribe({
        next: () => {
          this.notificationService.success(
            'Creado',
            'Proveedor registrado correctamente'
          );
          this.router.navigate(['/admin/suppliers']);
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            err.error?.message || 'No se pudo registrar el proveedor'
          );
        },
      });
    }
  }

  goToSuppliers() {
    this.router.navigate(['/admin/suppliers']);
  }
}
