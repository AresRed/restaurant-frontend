import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, AvatarModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  notifications = [
    {
      type: 'success',
      title: 'Orden completada',
      message: 'Tu orden #12345 ha sido entregada con éxito.',
      time: 'Hace 2h',
      icon: 'pi pi-check-circle',
    },
    {
      type: 'info',
      title: 'Nueva promoción',
      message: 'Aprovecha el 20% de descuento en tu próxima compra.',
      time: 'Hace 5h',
      icon: 'pi pi-bell',
    },
    {
      type: 'warning',
      title: 'Reserva pendiente',
      message: 'Tienes una reserva mañana a las 8:00 pm.',
      time: 'Hace 1 día',
      icon: 'pi pi-exclamation-triangle',
    },
    {
      type: 'danger',
      title: 'Error de pago',
      message: 'Tu método de pago fue rechazado. Inténtalo de nuevo.',
      time: 'Hace 2 días',
      icon: 'pi pi-times-circle',
    },
  ];
}
