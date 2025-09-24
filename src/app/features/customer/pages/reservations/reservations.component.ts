import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { gsap } from 'gsap';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

interface Times {
  label: string;
  value: string;
}

interface Table {
  id: number;
  capacity: number;
  selected: boolean;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    DropdownModule,
    TextareaModule,
    ButtonModule,
    FloatLabel,
    TooltipModule,
  ],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements AfterViewInit {
  reservationForm: FormGroup;

  guests = [
    { label: '1 persona', value: 1 },
    { label: '2 personas', value: 2 },
    { label: '3 personas', value: 3 },
    { label: '4 personas', value: 4 },
    { label: '5 personas', value: 5 },
  ];

  times: Times[] = [
    { label: '12:00 PM', value: '12:00' },
    { label: '12:30 PM', value: '12:30' },
    { label: '1:00 PM', value: '13:00' },
    { label: '1:30 PM', value: '13:30' },
    { label: '2:00 PM', value: '14:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '6:30 PM', value: '18:30' },
    { label: '7:00 PM', value: '19:00' },
    { label: '7:30 PM', value: '19:30' },
  ];

  tables: Table[] = [
    { id: 1, capacity: 2, selected: false },
    { id: 2, capacity: 4, selected: false },
    { id: 3, capacity: 2, selected: false },
    { id: 4, capacity: 6, selected: false },
    { id: 5, capacity: 4, selected: false },
  ];

  selectedTable: Table | null = null;

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date: [null, Validators.required],
      time: [null, Validators.required],
      guests: [null, Validators.required],
      message: [''],
    });
  }

  ngAfterViewInit() {
    gsap.from('.tablee-map .tablee', {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0,
    });
  }

  selectTable(table: Table, event?: MouseEvent) {
    this.tables.forEach((t) => (t.selected = false));
    table.selected = true;
    this.selectedTable = table;

    if (event) {
      gsap.fromTo(
        event.currentTarget,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }
  }

  onSubmit() {
    if (!this.selectedTable) {
      alert('Por favor selecciona una mesa.');
      return;
    }

    if (this.reservationForm.valid) {
      const reservationData = {
        ...this.reservationForm.value,
        table: this.selectedTable.id,
      };
      console.log('Reserva enviada:', reservationData);
      alert('¡Reserva enviada! Nos pondremos en contacto contigo.');
      this.reservationForm.reset();
      this.tables.forEach((t) => (t.selected = false));
      this.selectedTable = null;
    } else {
      alert('Por favor completa todos los campos obligatorios.');
    }
  }
}
