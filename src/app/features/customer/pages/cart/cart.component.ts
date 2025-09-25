import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { CartItem } from '../../../../core/models/cart.model';
import { CartService } from '../../../../core/services/cart.service';
import { PaymentService } from '../../../../core/services/payment.service';

declare var MercadoPago: any;

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  private sub: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService
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
    this.cartService.updateQuantity(item.id, (item.quantity || 0) - 1);
  }

  onQuantityChange(item: CartItem, value: any) {
    const q = Number(value);
    this.cartService.updateQuantity(item.id, Math.floor(q));
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id);
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    this.paymentService.createPreference(this.items).subscribe({
      next: (preference) => {
        this.paymentService.checkout(preference.id);
      },
      error: (err) => console.error(err),
    });
  }

  trackById(index: number, item: CartItem) {
    return item.id;
  }
}
