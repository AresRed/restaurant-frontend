import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToggleButtonModule } from 'primeng/togglebutton';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  popular: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToggleButtonModule,
    TabsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  showTable = false;

  categories = ['Entradas', 'Platos Principales', 'Postres', 'Bebidas'];
  selectedCategory = 'Entradas';

  menu: MenuItem[] = [
    {
      id: 1,
      name: 'Ceviche Clásico',
      description: 'Pescado fresco marinado en limón con cebolla y ají.',
      category: 'Entradas',
      price: 25,
      image: 'https://images.unsplash.com/photo-1604908177097-f9d7ad8e0f5e',
      popular: true,
    },
    {
      id: 2,
      name: 'Pollo a la Brasa',
      description: 'Clásico pollo sazonado acompañado de papas fritas.',
      category: 'Platos Principales',
      price: 45,
      image: 'https://images.unsplash.com/photo-1625940677659-2b4ecf9c5a32',
      popular: false,
    },
  ];

  getMenuByCategory(category: string): MenuItem[] {
    return this.menu.filter((m) => m.category === category);
  }

  addToOrder(item: MenuItem) {
    console.log('Añadir a orden:', item);
  }

  viewDetails(item: MenuItem) {
    console.log('Ver detalles:', item);
  }

  editItem(item: MenuItem) {
    console.log('Editar item:', item);
  }
}
