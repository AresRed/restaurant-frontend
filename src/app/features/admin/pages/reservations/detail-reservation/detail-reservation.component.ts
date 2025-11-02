import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import {
  ReservationResponse,
  ReservationStatus,
} from '../../../../../core/models/reservation.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ReservationService } from '../../../../../core/services/reservation.service';
import { ReservationStatusPipe } from '../../../../../shared/pipes/reservation-status.pipe';

@Component({
  selector: 'app-detail-reservation',
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule,
    AvatarModule,
    TooltipModule,
    ConfirmPopupModule,
    ReservationStatusPipe,
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      if (!isNaN(id)) {
        this.loadReservation(id);
      } else {
        this.handleInvalidId();
      }
    } else {
      this.handleInvalidId();
    }
  }

  loadReservation(id: number) {
    this.loading = true;
    this.reservationService.getReservationById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.reservation = res.data;
        } else {
          this.notificationService.error(
            'Error',
            'No se encontraron datos para esta reservación.'
          );
          this.router.navigate(['/admin/reservations']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservación:', err);
        this.notificationService.error(
          'Error',
          err.error?.message || 'No se pudo cargar la reservación.'
        );
        this.router.navigate(['/admin/reservations']);
        this.loading = false;
      },
    });
  }

  private handleInvalidId(): void {
    this.notificationService.error('Error', 'ID de reservación inválido.');
    this.router.navigate(['/admin/reservations']);
    this.loading = false;
  }

  goBack() {
    this.router.navigate(['/admin/reservations']);
  }

  editReservation(id: number | undefined) {
    if (id) {
      this.router.navigate(['/admin/reservations', id, 'edit']);
    }
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getStatusSeverity(
    status: ReservationStatus | undefined
  ): 'success' | 'warn' | 'danger' | 'info' {
    if (!status) return 'info';
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'CANCELLED':
        return 'danger';
      case 'COMPLETED':
        return 'info';
      default:
        return 'info';
    }
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

  deleteReservation(id: number | undefined, event: Event) {
    // Acepta undefined
    if (!id) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget, // Target para el pop-up
      message: `¿Estás seguro de que quieres eliminar la reservación #${id}? Esta acción no se puede deshacer.`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle text-red-500',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.loading = true; // Mostrar indicador mientras se borra
        this.reservationService.deleteReservation(id).subscribe({
          next: () => {
            this.notificationService.success(
              'Éxito',
              'Reservación eliminada correctamente.'
            );
            this.router.navigate(['/admin/reservations']);
          },
          error: (err) => {
            console.error('Error al eliminar reservación:', err);
            this.notificationService.error(
              'Error',
              err.error?.message || 'No se pudo eliminar la reservación.'
            );
            this.loading = false; // Quita el indicador si hay error
          },
        });
      },
    });
  }
}
