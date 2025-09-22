import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
/* PrimeNG */
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,

    /* PrimeNG */
    DropdownModule,
    CalendarModule,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  guests = [
    { label: '1 guest', value: 1 },
    { label: '2 guests', value: 2 },
    { label: '3 guests', value: 3 },
    { label: '4 guests', value: 4 },
  ];

  times = [
    { label: '6:00 PM', value: '18:00' },
    { label: '6:30 PM', value: '18:30' },
    { label: '7:00 PM', value: '19:00' },
    { label: '7:30 PM', value: '19:30' },
  ];

  selectedGuest: number | undefined;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
}
