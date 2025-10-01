import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { OAuthModule } from 'angular-oauth2-oidc';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OAuthModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FrondRestaurant';
}
