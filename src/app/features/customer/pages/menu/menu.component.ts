import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CategoryResponse } from '../../../../core/models/category.model';
import { ProductResponse } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  categories: CategoryResponse[] = [];
  products: ProductResponse[] = [];
  allProducts: ProductResponse[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories = [
            {
              id: 0,
              name: 'Todos',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...res.data,
          ];
        }
      },
      error: (err) => console.error('Error cargando categorías', err),
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        if (res.success) {
          this.allProducts = res.data;
          this.products = [...this.allProducts];
          this.selectedCategoryId = 0;
        }
      },
      error: (err) => console.error('Error cargando productos', err),
    });
  }

  filterByCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
    if (categoryId === 0) {
      this.products = [...this.allProducts];
    } else {
      this.products = this.allProducts.filter(
        (p) => p.categoryId === categoryId
      );
    }
  }

  addToCart(product: ProductResponse) {
    const existing = this.cartService.items.find((i) => i.id === product.id);
    this.cartService.addItem(product);

    if (existing) {
      this.notificationService.info(
        'Cantidad actualizada',
        `Ahora tienes ${existing.quantity} de ${product.name} en el carrito.`
      );
    } else {
      this.notificationService.success(
        'Producto agregado',
        `${product.name} ha sido agregado al carrito.`
      );
    }
  }
}
