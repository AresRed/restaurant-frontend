import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import {
  ReservationResponse,
  ReservationStatus,
} from '../../../../../core/models/reservation.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ReservationService } from '../../../../../core/services/reservation.service';

@Component({
  selector: 'app-detail-reservation',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './detail-reservation.component.html',
  styleUrl: './detail-reservation.component.scss',
})
export class DetailReservationComponent implements OnInit {
  reservation?: ReservationResponse;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadReservation(id);
  }

  loadReservation(id: number) {
    this.reservationService.getReservationById(id).subscribe({
      next: (res) => {
        this.reservation = res.data;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error(
          'Error',
          'No se pudo cargar la reservación.'
        );
        this.router.navigate(['/admin/reservations']);
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/reservations']);
  }

  editReservation(id: number) {
    this.router.navigate(['/admin/reservations', id, 'edit']);
  }

  getStatusLabel(status: ReservationStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'CANCELLED':
        return 'Cancelada';
      case 'COMPLETED':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  }

  deleteReservation(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Deseas eliminar esta reservación?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.reservationService.deleteReservation(id).subscribe({
          next: () => {
            this.notificationService.success('Éxito', 'Reservación eliminada.');
            this.router.navigate(['/admin/reservations']);
          },
          error: () =>
            this.notificationService.error('Error', 'No se pudo eliminar.'),
        });
      },
    });
  }
}
