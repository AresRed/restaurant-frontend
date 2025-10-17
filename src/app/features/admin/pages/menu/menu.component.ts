import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProductResponse } from '../../../../core/models/products/product/product.model';
import { CategoryService } from '../../../../core/services/category.service';
import { ConfirmService } from '../../../../core/services/confirmation.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProductService } from '../../../../core/services/products/product/product.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToggleButtonModule,
    TooltipModule,
    TabsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  products: ProductResponse[] = [];
  categories: string[] = [];
  selectedCategory = '';
  showTable = false;
  loading = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data.map((c: any) => c.name);
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
        }
      },
      error: () =>
        this.notificationService.error('Error', 'Error al cargar categorías'),
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Error', 'Error al cargar productos');
        this.loading = false;
      },
    });
  }

  getProductsByCategory(category: string) {
    return this.products.filter((p) => p.categoryName === category);
  }

  viewDetails(item: ProductResponse) {
    this.notificationService.info('Detalles', `Producto: ${item.name}`);
  }

  editItem(item: ProductResponse) {
    this.notificationService.info('Editar', `Editando: ${item.name}`);
  }

  async confirmDelete(event: Event, item: ProductResponse) {
    const confirmed = await this.confirmService.confirm(
      {
        message: `¿Seguro que deseas eliminar "${item.name}" del menú?`,
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
      },
      event
    );

    if (confirmed) {
      this.productService.deleteProduct(item.id).subscribe({
        next: () => {
          this.notificationService.success(
            'Eliminado',
            'Producto eliminado correctamente'
          );
          this.products = this.products.filter((p) => p.id !== item.id);
        },
        error: () =>
          this.notificationService.error('Error', 'Error al eliminar producto'),
      });
    }
  }
}
