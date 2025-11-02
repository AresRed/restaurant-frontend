import { Pipe, PipeTransform } from '@angular/core';
import { ReservationStatus } from '../../core/models/reservation.model';

@Pipe({
  name: 'reservationStatus',
  standalone: true,
})
export class ReservationStatusPipe implements PipeTransform {
  transform(value: ReservationStatus | undefined | null): string {
    if (!value) {
      return 'Desconocido';
    }

    switch (value) {
      case 'PENDING':
        return 'Pendiente ⏳';
      case 'CONFIRMED':
        return 'Confirmada ✅';
      case 'CANCELLED':
        return 'Cancelada ❌';
      case 'COMPLETED':
        return 'Completada🏁';
      default:
        return value;
    }
  }
}
