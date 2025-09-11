import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnProcesoComponent } from './en-proceso/en-proceso.component';
import { HeaderComponent } from './shared/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { OAuthModule } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [
    EnProcesoComponent,
    HeaderComponent,
    HomeComponent,
    HttpClientModule,
    LoginComponent,
    OAuthModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrondRestaurant';
}
