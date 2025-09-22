import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiService } from '../../../core/services/ui.service';
import { LoginDrawerComponent } from '../../../features/auth/components/login-drawer/login-drawer.component';
import { CartDrawerComponent } from '../../../features/customer/components/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginDrawerComponent,
    CartDrawerComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(public uiService: UiService) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openLogin() {
    this.uiService.openLogin();
  }

  openSignup() {
    this.uiService.openSignup();
  }

  openCart() {
    this.uiService.openCart();
  }
}
