import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, TabsModule, RatingModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  orderReviews: {
    orderId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[] = []; // ✅ siempre inicializado

  reservationReviews: {
    placeName: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[] = []; // ✅ siempre inicializado

  productReviews: {
    productName: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[] = []; // ✅ siempre inicializado

  constructor() {
    // Simulación de datos cargados
    this.orderReviews = [
      {
        orderId: '12345',
        rating: 4,
        comment: 'Muy buena experiencia con la entrega.',
        createdAt: new Date(),
      },
    ];

    this.reservationReviews = [
      {
        placeName: 'Restaurante La Terraza',
        rating: 5,
        comment: 'Excelente atención y comida deliciosa.',
        createdAt: new Date(),
      },
    ];

    this.productReviews = [
      {
        productName: 'Café Premium',
        rating: 4,
        comment: 'Muy buen sabor, aunque llegó un poco frío.',
        createdAt: new Date(),
      },
    ];
  }
}
