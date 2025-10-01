import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
/* PrimeNG */
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  guests = [
    { label: '3 ', value: 1 },
    { label: '4 ', value: 2 },
    { label: '5 ', value: 3 },
    { label: '6 ', value: 4 },
    { label: '7 ', value: 2 },
    { label: '8 ', value: 3 },
    { label: '9 ', value: 4 },
    { label: '10 ', value: 2 },
    { label: '11 ', value: 3 },
    { label: '12 ', value: 4 },
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

  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }
}
