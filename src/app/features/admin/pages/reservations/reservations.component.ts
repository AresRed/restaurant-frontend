import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import {
  ReservationRequest,
  ReservationResponse,
} from '../../../../core/models/reservation.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReservationService } from '../../../../core/services/reservation.service';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    FloatLabelModule
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {
  reservations: ReservationResponse[] = [];
  filteredReservations: ReservationResponse[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedDate: Date | null = null;
  currentMonth: Date = new Date();

  statusOptions = [
    { label: '🕓 Pendiente', value: 'PENDING' },
    { label: '✅ Confirmada', value: 'CONFIRMED' },
    { label: '❌ Cancelada', value: 'CANCELLED' },
  ];

  // Nueva reservación (campos mínimos)
  newReservation: Partial<ReservationResponse> = {
    customerName: '',
    reservationDate: '',
    reservationTime: '',
    numberOfPeople: 1,
    contactName: '',
    contactPhone: '',
    status: 'PENDING',
    tableId: 0,
  };

  loading = false;

  constructor(
    private reservationService: ReservationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (res) => {
        this.reservations = res.data.content || [];
        this.filteredReservations = [...this.reservations];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.notificationService.error(
          'Error',
          'No se pudieron cargar las reservaciones'
        );
        this.loading = false;
      },
    });
  }

  filterByDateRange(): void {
    if (!this.startDate || !this.endDate) {
      this.filteredReservations = [...this.reservations];
      return;
    }

    const start = this.formatDate(this.startDate);
    const end = this.formatDate(this.endDate);

    this.loading = true;
    this.reservationService.getReservationsByDateRange(start, end).subscribe({
      next: (res) => {
        this.filteredReservations = res.data.content || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al filtrar reservas:', err);
        this.notificationService.error(
          'Error',
          'No se pudo filtrar por rango de fechas'
        );
        this.loading = false;
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.filteredReservations = [...this.reservations];
  }

  // ------ calendario helpers ------
  getDaysOfMonth(): Date[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++)
      days.push(new Date(year, month, i));

    return days as Date[];
  }

  hasReservation(date: Date): boolean {
    if (!date) return false;
    return this.reservations.some(
      (r) => new Date(r.reservationDate).toDateString() === date.toDateString()
    );
  }

  selectDate(date: Date): void {
    if (!date) return;

    this.startDate = null;
    this.endDate = null;

    this.selectedDate = date;
    this.filteredReservations = this.reservations.filter(
      (r) => new Date(r.reservationDate).toDateString() === date.toDateString()
    );
  }

  changeMonth(offset: number): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + offset;
    this.currentMonth = new Date(year, month, 1);
  }

  changeYear(offset: number): void {
    const year = this.currentMonth.getFullYear() + offset;
    const month = this.currentMonth.getMonth();
    this.currentMonth = new Date(year, month, 1);
  }

  addReservation(payload?: Partial<ReservationResponse>): void {
    const p = payload ?? this.newReservation;

    // Validaciones mínimas
    if (!p.customerName && !p.contactName) {
      this.notificationService.warn(
        'Advertencia',
        'Debes indicar el nombre del cliente o contacto.'
      );
      return;
    }

    let reservationDateStr = '';
    const dateValue = p.reservationDate as any;

    if (dateValue instanceof Date) {
      reservationDateStr = dateValue.toISOString().split('T')[0];
    } else if (typeof dateValue === 'string' && dateValue) {
      if (dateValue.includes('T')) {
        reservationDateStr = dateValue.split('T')[0];
      } else {
        reservationDateStr = dateValue;
      }
    } else {
      this.notificationService.warn(
        'Advertencia',
        'Debes seleccionar una fecha de la reservación.'
      );
      return;
    }
    // reservationTime: si viene en formato datetime-local -> extraer parte de hora
    let reservationTimeStr = '';
    if (typeof p.reservationTime === 'string' && p.reservationTime) {
      if (p.reservationTime.includes('T'))
        reservationTimeStr = p.reservationTime.split('T')[1].slice(0, 5);
      else reservationTimeStr = p.reservationTime;
    } else {
      // si no hay hora pero la fecha sí, asumimos ahora (opcional)
      reservationTimeStr = new Date().toTimeString().slice(0, 5);
    }

    if (!p.numberOfPeople || p.numberOfPeople <= 0) {
      this.notificationService.warn(
        'Advertencia',
        'Número de personas inválido.'
      );
      return;
    }

    // Construir request según interface ReservationRequest (backend)
    const req: Partial<ReservationRequest> = {
      // si tienes customerId lo pones, si no se deja para el backend
      customerId: (p as any).customerId ?? undefined,
      tableId: p.tableId && p.tableId > 0 ? p.tableId : undefined,
      contactName: p.contactName ?? p.customerName ?? '',
      contactPhone: p.contactPhone ?? '',
      reservationDate: reservationDateStr,
      reservationTime: reservationTimeStr,
      numberOfPeople: p.numberOfPeople,
      status: (p.status as any) ?? 'PENDING',
    };

    this.loading = true;
    this.reservationService
      .addReservation(req as ReservationRequest)
      .subscribe({
        next: (res) => {
          const created = res.data;
          const createdItem = Array.isArray(created) ? created[0] : created;

          if (createdItem) {
            this.reservations.unshift(createdItem);
            if (this.startDate && this.endDate) {
              const d = new Date(createdItem.reservationDate);
              if (d >= this.startDate! && d <= this.endDate!) {
                this.filteredReservations.unshift(createdItem);
              }
            } else {
              this.filteredReservations.unshift(createdItem);
            }
          }

          this.notificationService.success(
            'Éxito',
            'Reservación creada correctamente.'
          );
          // reset form mínimo
          this.newReservation = {
            customerName: '',
            reservationDate: '',
            reservationTime: '',
            numberOfPeople: 1,
            contactName: '',
            contactPhone: '',
            status: 'PENDING',
            tableId: 0,
          };
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al crear reservación:', err);
          this.notificationService.error(
            'Error',
            'No se pudo crear la reservación.'
          );
          this.loading = false;
        },
      });
  }
}
