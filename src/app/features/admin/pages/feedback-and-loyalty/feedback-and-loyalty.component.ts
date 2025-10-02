import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

interface Review {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

interface LoyaltyPrize {
  id: number;
  name: string;
  pointsRequired: number;
}

@Component({
  selector: 'app-feedback-and-loyalty',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './feedback-and-loyalty.component.html',
  styleUrls: ['./feedback-and-loyalty.component.scss'],
})
export class FeedbackAndLoyaltyComponent {
  reviews: Review[] = [
    {
      id: 1,
      customer: 'Juan Pérez',
      rating: 5,
      comment: 'Excelente servicio!',
      date: '2025-10-01',
    },
    {
      id: 2,
      customer: 'Ana Torres',
      rating: 4,
      comment: 'Muy buena atención',
      date: '2025-09-30',
    },
    {
      id: 3,
      customer: 'Carlos Díaz',
      rating: 3,
      comment: 'Podría mejorar',
      date: '2025-09-28',
    },
    {
      id: 4,
      customer: 'Luis Rojas',
      rating: 5,
      comment: 'Todo perfecto',
      date: '2025-09-25',
    },
    {
      id: 5,
      customer: 'María López',
      rating: 4,
      comment: 'Rápido y eficiente',
      date: '2025-09-20',
    },
    // Agrega más reseñas
  ];

  loyaltyStats = {
    totalCustomers: 120,
    totalPointsAccumulated: 5800,
    totalPointsRedeemed: 2400,
    topCustomers: [
      { name: 'Juan Pérez', points: 500 },
      { name: 'Ana Torres', points: 420 },
      { name: 'Carlos Díaz', points: 380 },
    ],
  };

  prizes: LoyaltyPrize[] = [
    { id: 1, name: 'Camiseta de Marca', pointsRequired: 300 },
    { id: 2, name: 'Descuento 20%', pointsRequired: 200 },
    { id: 3, name: 'Bebida Gratis', pointsRequired: 100 },
  ];

  // Paginación de reseñas
  reviewsPerPage = 3;
  currentPage = 0;

  // Dialog nuevo premio
  displayNewPrizeDialog = false;
  newPrizeName = '';
  newPrizePoints = 0;

  createPrize() {
    if (this.newPrizeName && this.newPrizePoints > 0) {
      const newId = this.prizes.length + 1;
      this.prizes.push({
        id: newId,
        name: this.newPrizeName,
        pointsRequired: this.newPrizePoints,
      });
      this.newPrizeName = '';
      this.newPrizePoints = 0;
      this.displayNewPrizeDialog = false;
    }
  }

  get paginatedReviews() {
    const start = this.currentPage * this.reviewsPerPage;
    return this.reviews.slice(start, start + this.reviewsPerPage);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
  }
}
