import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../../../core/models/category.model';
import { ProductResponse } from '../../../../core/models/products/product/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { CategoryService } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProductService } from '../../../../core/services/products/product/product.service';
import { UbicationService } from '../../../../core/services/ubication.service';
import { UiService } from '../../../../core/services/ui.service';
import { UbicationComponent } from '../ubication/ubication.component';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    UbicationComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  categories: CategoryResponse[] = [];

  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  originalProducts: ProductResponse[] = [];

  selectedCategoryId: number | null = null;
  total$!: Observable<number>;
  count$!: Observable<number>;

  first: number = 0;
  rows: number = 12;

  constructor(
    private ubicationService: UbicationService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private uiService: UiService
  ) {}

  viewUbication() {
    this.ubicationService.open();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.total$ = this.cartService.total$;
    this.count$ = this.cartService.count$;
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
    this.productService.getAllActive().subscribe({
      next: (res) => {
        if (res.success) {
          this.originalProducts = res.data;
          this.filterByCategory(0);
        }
      },
      error: (err) => console.error('Error cargando productos', err),
    });
  }

  filterByCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;

    if (categoryId === 0) {
      this.filteredProducts = [...this.originalProducts];
    } else {
      this.filteredProducts = this.originalProducts.filter(
        (p) => p.categoryId === categoryId
      );
    }

    this.first = 0;
    this.updatePage();
  }

  updatePage() {
    this.products = this.filteredProducts.slice(
      this.first,
      this.first + this.rows
    );
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePage();
  }

  openCart() {
    this.uiService.openCart();
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
