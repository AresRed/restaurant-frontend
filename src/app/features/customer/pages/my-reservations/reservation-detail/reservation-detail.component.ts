import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReservationResponse } from '../../../../../core/models/reservation.model';
import { ReservationService } from '../../../../../core/services/reservation.service';

@Component({
  selector: 'app-reservation-detail',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    DividerModule,
  ],
  providers: [DatePipe],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.scss',
})
export class ReservationDetailComponent implements OnInit {
  reservationId!: number;
  reservation!: ReservationResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('id')) ?? '';
    if (this.reservationId) {
      this.loadReservation();
    }
  }

  loadReservation() {
    this.loading = true;
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (res) => {
        this.reservation = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/my-reservations']);
  }
}
