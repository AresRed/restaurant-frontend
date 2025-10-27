import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { SupplierResponse } from '../../../../../core/models/supplier.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-detail-supplier',
  imports: [
    ProgressSpinnerModule,
    ButtonModule,
    AvatarModule,
    CommonModule,
    TagModule,
  ],
  templateUrl: './detail-supplier.component.html',
  styleUrl: './detail-supplier.component.scss',
})
export class DetailSupplierComponent implements OnInit {
  supplier?: SupplierResponse;
  loading = true;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      this.loadSupplier();
    } else {
      this.notificationService.error('Error', 'ID de proveedor inválido');
      this.router.navigate(['/admin/suppliers']);
    }
  }

  loadSupplier() {
    this.supplierService.getSupplierById(this.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.supplier = res.data;
        } else {
          this.notificationService.error('Error', 'Proveedor no encontrado');
          this.router.navigate(['/admin/suppliers']);
        }
        this.loading = false;
      },
      error: () => {
        this.notificationService.error(
          'Error',
          'No se pudo cargar el proveedor'
        );
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/suppliers']);
  }

  editSupplier() {
    this.router.navigate([`/admin/suppliers/${this.id}/edit`]);
  }
}
