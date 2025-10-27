import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ProductResponse } from '../../../../../core/models/products/product/product.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ProductService } from '../../../../../core/services/products/product/product.service';

@Component({
  selector: 'app-detail-menu',
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './detail-menu.component.html',
  styleUrl: './detail-menu.component.scss',
})
export class DetailMenuComponent implements OnInit {
  product?: ProductResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadProduct(id);
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.product = res.data as unknown as ProductResponse;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  goToMenu() {
    this.router.navigate(['admin/menu']);
  }

  goToEdit(productId: number) {
    this.router.navigate(['admin/menu', productId, 'edit']);
  }

  deleteProduct(product: ProductResponse, event?: Event) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: `¿Estás seguro de eliminar el producto ${product.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.notificationService.success(
              'Éxito',
              'Producto eliminado correctamente.'
            );
            this.router.navigate(['admin/menu']);
          },
          error: () => {
            this.notificationService.error(
              'Error',
              'No se pudo eliminar el producto.'
            );
          },
        });
      },
    });
  }
}
