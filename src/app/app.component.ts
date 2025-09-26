import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { OAuthModule } from 'angular-oauth2-oidc';
import { ToastModule } from 'primeng/toast';
import { LoginDrawerComponent } from './features/auth/components/login-drawer/login-drawer.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    OAuthModule,
    FooterComponent,
    LoginDrawerComponent,
    HeaderComponent,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FrondRestaurant';
}
