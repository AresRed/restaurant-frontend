import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { OAuthModule } from 'angular-oauth2-oidc';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OAuthModule, ToastModule, ConfirmPopupModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'FrondRestaurant';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    if (token && this.authService.isTokenExpired(token)) {
      this.authService.logout().subscribe();
    }
  }
}
