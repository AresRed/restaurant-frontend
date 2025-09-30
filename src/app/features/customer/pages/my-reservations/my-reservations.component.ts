import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ReservationService } from '../../../../core/services/reservation.service';
import { ReservationResponse } from '../../../../core/models/reservation.model';

@Component({
  selector: 'app-my-reservations',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    TagModule,
  ],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss',
})
export class MyReservationsComponent implements OnInit {
  reservations: ReservationResponse[] = [];
  loading = true;

  constructor(
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getAllReservationsAuth().subscribe({
      next: (res) => {
        this.reservations = res.data.content;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  viewDetail(id: number) {
    this.router.navigate(['/my-reservations', id]);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
