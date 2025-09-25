import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([
    {
      id: 1,
      name: 'Comida',
      price: 2,
      quantity: 2,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkGTV9ptpoJ1nv8SE8QJ_A4-pCjnd46axWiA&s',
    },
  ]);
  items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  addItem(item: CartItem) {
    const existing = this.items.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
      this.itemsSubject.next([...this.items]);
    } else {
      this.itemsSubject.next([...this.items, { ...item, quantity: 1 }]);
    }
  }

  removeItem(id: number) {
    this.itemsSubject.next(this.items.filter((i) => i.id !== id));
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;
    if (quantity <= 0) this.removeItem(id);
    else {
      item.quantity = quantity;
      this.itemsSubject.next([...this.items]);
    }
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  clear() {
    this.itemsSubject.next([]);
  }
}
