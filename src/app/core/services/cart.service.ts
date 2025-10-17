import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { ProductResponse } from '../models/products/product/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly IGV_RATE = 0.18;
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  items$ = this.itemsSubject.asObservable();

  total$ = this.items$.pipe(map((items) => this.getTotal()));

  count$ = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  private loadCart(): CartItem[] {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  }

  addItem(product: ProductResponse) {
    const existing = this.items.find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.imageUrl || '',
      };
      this.items.push(newItem);
    }
    this.itemsSubject.next([...this.items]);
    this.saveCart();
  }

  removeItem(id: number) {
    this.itemsSubject.next(this.items.filter((i) => i.id !== id));
    this.saveCart();
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;
    if (quantity <= 0) this.removeItem(id);
    else {
      item.quantity = quantity;
      this.itemsSubject.next([...this.items]);
      this.saveCart();
    }
  }

  getTotal(): number {
    return this.items.reduce(
      (sum, i) => sum + i.price * (1 + this.IGV_RATE) * i.quantity,
      0
    );
  }

  getSubtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  getIGV(): number {
    return this.getTotal() - this.getSubtotal();
  }

  clear() {
    this.itemsSubject.next([]);
    localStorage.removeItem('cart');
  }
}
