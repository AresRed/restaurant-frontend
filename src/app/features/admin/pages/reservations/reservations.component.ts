import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

interface Reservation {
  id: number;
  customer: string;
  date: Date;
  guests: number;
  status: 'Pendiente' | 'Confirmada' | 'Cancelada';
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [
    {
      id: 1,
      customer: 'Juan Pérez',
      date: new Date('2025-10-02 19:00'),
      guests: 2,
      status: 'Confirmada',
    },
    {
      id: 2,
      customer: 'Ana Torres',
      date: new Date('2025-10-02 20:00'),
      guests: 4,
      status: 'Pendiente',
    },
    {
      id: 3,
      customer: 'Carlos Díaz',
      date: new Date('2025-10-03 18:30'),
      guests: 3,
      status: 'Cancelada',
    },
  ];

  // Calendario
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;

  // Tabla de reservas filtradas
  filteredReservations: Reservation[] = [];

  // Formulario nueva reserva
  newReservation: Reservation = {
    id: 0,
    customer: '',
    date: new Date(),
    guests: 1,
    status: 'Pendiente',
  };

  ngOnInit() {
    this.filteredReservations = [...this.reservations];
  }

  // Obtener los días del mes actual
  getDaysOfMonth(): Date[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // rellenar días vacíos hasta el primer día de la semana
    const startDay = firstDay.getDay(); // 0=Dom, 1=Lun
    for (let i = 0; i < startDay; i++) {
      days.push(null as any);
    }

    // días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }

  // Comprobar si hay reservas en un día
  hasReservation(date: Date): boolean {
    if (!date) return false;
    return this.reservations.some(
      (r) => r.date.toDateString() === date.toDateString()
    );
  }

  // Seleccionar un día
  selectDate(date: Date) {
    if (!date) return;
    this.selectedDate = date;
    this.filteredReservations = this.reservations.filter(
      (r) => r.date.toDateString() === date.toDateString()
    );
  }

  // Navegar meses
  changeMonth(offset: number) {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + offset;
    this.currentMonth = new Date(year, month, 1);
  }

  // Navegar años
  changeYear(offset: number) {
    const year = this.currentMonth.getFullYear() + offset;
    const month = this.currentMonth.getMonth();
    this.currentMonth = new Date(year, month, 1);
  }

  addReservation(res: Reservation) {
    res.id = this.reservations.length + 1;
    this.reservations.push({ ...res });
    this.newReservation = {
      id: 0,
      customer: '',
      date: new Date(),
      guests: 1,
      status: 'Pendiente',
    };
    if (this.selectedDate) this.selectDate(this.selectedDate);
    else this.filteredReservations = [...this.reservations];
  }

  // Filtrar tabla manualmente
  filterByDate(event: any) {
    const value = event.target.value;
    if (!value) {
      this.filteredReservations = [...this.reservations];
      this.selectedDate = null;
    } else {
      const date = new Date(value);
      this.selectedDate = date;
      this.filteredReservations = this.reservations.filter(
        (r) => r.date.toDateString() === date.toDateString()
      );
      this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    }
  }
}
