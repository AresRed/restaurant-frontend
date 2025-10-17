import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { CartItem } from '../../../../core/models/cart.model';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  private sub: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub.add(
      this.cartService.items$.subscribe((items) => (this.items = items))
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  increaseQty(item: CartItem) {
    this.cartService.updateQuantity(item.id, (item.quantity || 0) + 1);
  }

  decreaseQty(item: CartItem) {
    const newQty = (item.quantity || 0) - 1;
    if (newQty <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.id, newQty);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id);
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get igv(): number {
    return this.cartService.getIGV();
  }

  finalizeOrder() {
    if (!this.items.length) {
      this.notificationService.error('Tu carrito está vacío');
      return;
    }

    this.router.navigate(['/checkout']);
  }

  onCheckoutComplete() {
    this.cartService.clear();
  }

  trackById(index: number, item: CartItem) {
    return item.id;
  }
}
