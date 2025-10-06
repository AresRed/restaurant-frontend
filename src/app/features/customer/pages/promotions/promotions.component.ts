import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, ButtonModule, CarouselModule, TagModule],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss',
})
export class PromotionsComponent {
  promotions = [
    {
      title: '2x1 en Café Premium',
      description:
        'Disfruta del mejor café en grano con esta promoción especial.',
      discount: '2x1',
      image:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
      validUntil: new Date(2025, 11, 31),
    },
    {
      title: '30% de descuento en Reservas',
      description: 'Haz tu reserva online y obtén un 30% de descuento.',
      discount: '-30%',
      image:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
      validUntil: new Date(2025, 10, 20),
    },
    {
      title: 'Envío gratis en tu primera orden',
      description: 'Realiza tu primera compra y recibe envío gratuito.',
      discount: 'Free',
      image:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
      validUntil: new Date(2025, 9, 15),
    },
  ];
}
