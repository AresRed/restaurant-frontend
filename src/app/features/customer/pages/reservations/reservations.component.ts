import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
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
    
    InputTextModule,
    DatePickerModule,
    DropdownModule,
    TextareaModule,
    ButtonModule,
    FloatLabel,
    TooltipModule,
    FormsModule, 
     

  ],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements OnInit {
  
  
  selectedGuests: any;
  selectedTime: any;
  selectedDate: any;

  fullName: string = '';
  email: string = '';
  phone: string = '';
  specifications: string = '';
  
  guestsOptions: any[] = [
    { label: '1 Persona', value: 1 },
    { label: '2 Persona', value: 2 },
    { label: '3 Persona', value: 3 }
  ];

  timeOptions: any[] = [
    { label: 'Hora', value: 'all' },
    { label: '7:00 PM', value: '7:00' },
    { label: '7:30 PM', value: '7:30' }
  ];

  dateOptions: any[] = [
    { label: 'Hoy, Sep 29', value: new Date() },
    { label: 'Martes, Sep 29', value: new Date() },
    { label: 'Miercoles, Sep 29', value: new Date() },
  ];

  
  timeSlots = [
    { Mesa: 'Ocupada',  available: false},
    { Mesa: '3',  available: true },
    { Mesa: '4',  available: true },
    { Mesa: '5',  available: true },
    { Mesa: '6',  available: true },
    { Mesa: '7',  available: true },

  
  ];

  constructor() { }

  ngOnInit(): void {
  
    this.selectedGuests = this.guestsOptions[0]; 
    this.selectedTime = this.timeOptions[0];    
    this.selectedDate = this.dateOptions[0];    
  }

  reserveTime(slot: any) {
    
    
  }

  showAlert() {
    
    
  }
  
}
