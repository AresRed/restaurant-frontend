import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ReservationResponse } from '../../../../core/models/reservation.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReservationService } from '../../../../core/services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    TagModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {
  reservations: ReservationResponse[] = [];
  filteredReservations: ReservationResponse[] = [];

  dateRange: Date[] | null = null;

  selectedDate: Date | null = null;
  currentMonth: Date = new Date();

  loading = false;

  constructor(
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (res) => {
        this.reservations = res.data.content || [];
        this.applyFilters();
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

  applyFilters(): void {
    let tempReservations = [...this.reservations];

    if (this.selectedDate) {
      const selectedDateString = this.selectedDate.toDateString();
      tempReservations = tempReservations.filter(
        (r) => new Date(r.reservationDate).toDateString() === selectedDateString
      );
    }
    // Filtro por rango de fechas del p-calendar
    else if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
      const start = this.dateRange[0].setHours(0, 0, 0, 0);
      const end = this.dateRange[1].setHours(23, 59, 59, 999);
      tempReservations = tempReservations.filter((r) => {
        const resDate = new Date(r.reservationDate).getTime();
        return resDate >= start && resDate <= end;
      });
    }

    this.filteredReservations = tempReservations;
  }

  clearFilters(): void {
    this.selectedDate = null;
    this.dateRange = null;
    this.applyFilters(); // Vuelve a mostrar todas
  }

  getDaysOfMonth(): (Date | null)[] {
    // Tipo corregido
    // ... (lógica sin cambios) ...
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++)
      days.push(new Date(year, month, i));
    return days;
  }

  hasReservation(date: Date | null): boolean {
    if (!date) return false;
    const dateString = date.toDateString();
    return this.reservations.some(
      (r) => new Date(r.reservationDate).toDateString() === dateString
    );
  }

  selectDate(date: Date | null): void {
    if (!date) return;
    this.selectedDate = date;
    this.dateRange = null;
    this.applyFilters();
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

  goToCreateReservation(): void {
    this.router.navigate(['/admin/reservations/create']);
  }

  viewReservationDetail(id: number): void {
    this.router.navigate(['/admin/reservations', id]);
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warn';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }
}
