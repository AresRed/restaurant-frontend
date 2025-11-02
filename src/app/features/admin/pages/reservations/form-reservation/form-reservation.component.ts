import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-form-reservation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    AutoCompleteModule,
    ProgressSpinnerModule,
    FloatLabelModule,
    TooltipModule,
  ],
  templateUrl: './form-reservation.component.html',
  styleUrl: './form-reservation.component.scss',
})
export class FormReservationComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
