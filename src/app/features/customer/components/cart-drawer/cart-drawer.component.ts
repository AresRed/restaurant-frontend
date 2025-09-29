import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subscription } from 'rxjs';
import { CartItem } from '../../../../core/models/cart.model';
import { CartService } from '../../../../core/services/cart.service';
import { UiService } from '../../../../core/services/ui.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    ButtonModule,
    FormsModule,
    InputNumberModule,
  ],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss'],
})
export class CartDrawerComponent implements OnInit, OnDestroy {
  visible = false;
  items: CartItem[] = [];
  private sub: Subscription = new Subscription();

  constructor(
    private uiService: UiService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub.add(
      this.uiService.cartDrawerState$.subscribe(
        (state) => (this.visible = state)
      )
    );
    this.sub.add(
      this.cartService.items$.subscribe((items) => (this.items = items))
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  closeDrawer() {
    this.uiService.closeCart();
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  increaseQty(item: CartItem) {
    this.cartService.updateQuantity(item.id, (item.quantity || 0) + 1);
  }

  decreaseQty(item: CartItem) {
    this.cartService.updateQuantity(item.id, (item.quantity || 0) - 1);
  }

  onQuantityChange(item: CartItem, value: any) {
    const q = Number(value);
    if (!q || q <= 0) {
      this.cartService.removeItem(item.id);
      return;
    }
    this.cartService.updateQuantity(item.id, Math.floor(q));
  }

  get total() {
    return this.cartService.getTotal();
  }

  checkout() {
    this.closeDrawer();
    this.router.navigate(['/cart']);
  }

  trackById(index: number, item: CartItem) {
    return item.id;
  }
}
