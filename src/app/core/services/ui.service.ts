import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private loginDrawerState = new BehaviorSubject<{
    visible: boolean;
    tab: 'login' | 'register';
  }>({ visible: false, tab: 'login' });

  loginDrawerState$ = this.loginDrawerState.asObservable();

  openLogin() {
    this.loginDrawerState.next({ visible: true, tab: 'login' });
  }

  openSignup() {
    this.loginDrawerState.next({ visible: true, tab: 'register' });
  }

  closeLogin() {
    this.loginDrawerState.next({ visible: false, tab: 'login' });
  }

  private cartDrawerState = new BehaviorSubject<boolean>(false);
  cartDrawerState$ = this.cartDrawerState.asObservable();

  openCart() {
    this.cartDrawerState.next(true);
  }

  closeCart() {
    this.cartDrawerState.next(false);
  }
}