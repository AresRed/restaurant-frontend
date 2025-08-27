import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnProcesoComponent } from './en-proceso/en-proceso.component';
@Component({
  selector: 'app-root',
  imports: [EnProcesoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrondRestaurant';
}
