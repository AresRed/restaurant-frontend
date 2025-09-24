import { Component, OnInit } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Menubar, PrimeTemplate],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  items: MenuItem[] | undefined;
  constructor(private uiService : UiService){}
  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        routerLink: '/home',
      },
      {
        label: 'Menú',
        routerLink: '/menu',
      },
      {
        label: 'Nosotros',
        routerLink: '/home',
        fragment:'us',
      },
      {
        label: 'Reservas',
        routerLink: '/home',
        fragment:'resevation'
      },
      {
        label: 'Iniciar Sesion',
        command: ()=> this.uiService.openLoginDrawer()
      }
    ]
  }
}
