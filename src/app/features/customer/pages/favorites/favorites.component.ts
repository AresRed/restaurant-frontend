import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmService } from '../../../../core/services/confirmation.service';
import { NotificationService } from '../../../../core/services/notification.service';

export interface FavoriteItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TooltipModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  favorites: FavoriteItem[] = [];

  constructor(
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    // Simulación de data
    this.favorites = [
      {
        id: 1,
        name: 'Pizza Pepperoni',
        description: 'Deliciosa pizza con extra queso y pepperoni',
        imageUrl:
          'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'Hamburguesa Doble',
        description: 'Carne jugosa con pan artesanal y papas fritas',
        imageUrl:
          'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
        createdAt: new Date(),
      },
    ];
  }

  removeFavorite(id: number) {
    this.favorites = this.favorites.filter((f) => f.id !== id);
  }
}
