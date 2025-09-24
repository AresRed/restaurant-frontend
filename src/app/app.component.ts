import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { HttpClientModule } from '@angular/common/http';


import { OAuthModule } from 'angular-oauth2-oidc';
import { LoginDrawerComponent } from './features/auth/components/login-drawer/login-drawer.component';
import { FooterComponent } from './shared/components/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  
    HttpClientModule,
    HeaderComponent,
    RouterOutlet,
    OAuthModule,
    FooterComponent,
    LoginDrawerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FrondRestaurant';
}
