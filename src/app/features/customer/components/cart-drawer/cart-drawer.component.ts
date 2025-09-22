import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Subscription } from 'rxjs';
import { CartItem } from '../../../../core/models/cart.model';
import { UiService } from '../../../../core/services/ui.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule, FormsModule],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss'],
})
export class CartDrawerComponent implements OnInit, OnDestroy {
  visible = false;
  private sub: Subscription | null = null;

  items: CartItem[] = [
    {
      id: 1,
      name: 'Pizza Margarita',
      price: 20,
      quantity: 1,
      image: 'item1.jpg',
    },
    {
      id: 2,
      name: 'Bebida',
      price: 5,
      quantity: 2,
      image: 'items2.jpg',
    },
  ];

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.sub = this.uiService.cartDrawerState$.subscribe(
      (state) => (this.visible = state)
    );
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  closeDrawer() {
    this.uiService.closeCart();
  }

  removeItem(id: number) {
    this.items = this.items.filter((it) => it.id !== id);
  }

  increaseQty(item: CartItem) {
    item.quantity = (item.quantity || 0) + 1;
    this.items = [...this.items];
  }

  decreaseQty(item: CartItem) {
    if ((item.quantity || 0) > 1) {
      item.quantity = item.quantity - 1;
      this.items = [...this.items];
    } else {
      this.removeItem(item.id);
    }
  }

  onQuantityChange(item: CartItem, value: any) {
    const q = Number(value);
    if (!q || q <= 0) {
      this.removeItem(item.id);
      return;
    }
    item.quantity = Math.floor(q);
    this.items = [...this.items];
  }

  get total(): number {
    return this.items.reduce(
      (acc, it) => acc + (it.price || 0) * (it.quantity || 0),
      0
    );
  }

  trackById(index: number, item: CartItem) {
    return item.id;
  }

  checkout() {
    console.log('Checkout: items', this.items);
  }
}
