import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { AuthenticatedReservationRequest } from '../../../../core/models/reservation.model';
import { TableAvailabilityResponse } from '../../../../core/models/table.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReservationService } from '../../../../core/services/reservation.service';
import { TableService } from '../../../../core/services/table.service';

export interface TableUI extends TableAvailabilityResponse {
  selected: boolean;
}

type ReservationFormControls = {
  date: FormControl<Date | null>;
  guests: FormControl<number | null>;
  table: FormControl<number | null>;
  time: FormControl<string | { label: string; value: string } | null>;
  name: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  message: FormControl<string | null>;
};

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
    StepperModule,
    AutoCompleteModule,
  ],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements OnInit, AfterViewInit {
  reservationForm!: FormGroup<ReservationFormControls>;
  tables: TableUI[] = [];
  selectedTable: TableUI | null = null;

  guestsOptions: number[] = [];
  timeSuggestions: { label: string; value: string }[] = [];

  constructor(
    private tableService: TableService,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.reservationForm = new FormGroup<ReservationFormControls>({
      date: new FormControl<Date | null>(null, {
        validators: Validators.required,
      }),
      guests: new FormControl<number | null>(null, {
        validators: Validators.required,
      }),
      table: new FormControl<number | null>(null, {
        validators: Validators.required,
      }),
      time: new FormControl<string | { label: string; value: string } | null>(
        null,
        {
          validators: Validators.required,
        }
      ),
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      phone: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^[0-9]{9}$/)],
      }),
      message: new FormControl<string | null>(null),
    });
  }

  get fv() {
    return this.reservationForm.controls;
  }

  ngOnInit() {
    this.tableService.getAllTables().subscribe((res) => {
      const minCapacities = res.data.map((t) => t.minCapacity ?? t.capacity);
      const capacities = res.data.map((t) => t.capacity);

      const globalMin = Math.min(...minCapacities);
      const globalMax = Math.max(...capacities);

      this.guestsOptions = Array.from(
        { length: globalMax - globalMin + 1 },
        (_, i) => i + globalMin
      );
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

  loadAvailableTables() {
    const date = this.fv.date.value;
    const guests = this.fv.guests.value;

    if (!date || !guests) return;

    const dateStr =
      date instanceof Date ? date.toISOString().split('T')[0] : String(date);

    this.tableService
      .getTablesAvailabilityTimes(guests, dateStr, true)
      .subscribe({
        next: (res) => {
          this.tables = res.data.map((t) => ({ ...t, selected: false }));
          if (this.tables.length === 0) {
            this.notificationService.info(
              'Sin mesas',
              'No hay mesas disponibles para la fecha/personas seleccionadas'
            );
          }
        },
        error: (err) => {
          console.error('Error cargando mesas', err);
          this.notificationService.error(
            'Error',
            'No se pudieron obtener las mesas'
          );
        },
      });
  }

  selectTable(table: TableUI, event?: MouseEvent) {
    this.tables.forEach((t) => (t.selected = false));
    table.selected = true;
    this.selectedTable = table;
    this.fv.table.setValue(table.id);

    this.timeSuggestions = this.getAvailableTimesForSelectedTable();

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

  getAvailableTimesForSelectedTable(): { label: string; value: string }[] {
    if (!this.selectedTable) return [];
    return this.selectedTable.availableTimes.map((t) => ({
      label: t,
      value: t,
    }));
  }

  private normalizeTimeValue(
    timeVal: string | { label: string; value: string } | null
  ): string | null {
    if (!timeVal) return null;
    if (typeof timeVal === 'string') return timeVal;
    return timeVal.value ?? timeVal.label;
  }

  onSubmit() {
    if (!this.selectedTable) {
      this.notificationService.info('Por favor', 'Selecciona una mesa');
      return;
    }

    if (!this.reservationForm.valid) {
      this.notificationService.info(
        'Por favor',
        'Completa todos los campos obligatorios'
      );
      return;
    }

    const raw = this.reservationForm.getRawValue();
    const reservationDateStr =
      raw.date instanceof Date
        ? raw.date.toISOString().split('T')[0]
        : String(raw.date);
    const reservationTimeStr = this.normalizeTimeValue(raw.time);

    if (!reservationTimeStr) {
      this.notificationService.info('Por favor', 'Selecciona una hora válida');
      return;
    }

    const payload: AuthenticatedReservationRequest = {
      tableId: this.selectedTable.id,
      contactName: raw.name,
      contactPhone: raw.phone,
      reservationDate: reservationDateStr,
      reservationTime: reservationTimeStr,
      numberOfPeople: raw.guests!,
    };

    this.reservationService.addReservationAuth(payload).subscribe({
      next: (res) => {
        const reservationCreated = res?.data ?? res;

        if (!reservationCreated || !reservationCreated.id) {
          console.error('Respuesta completa del backend:', res);
          this.notificationService.error(
            'Error',
            'No se pudo obtener el ID de la reserva creada'
          );
          return;
        }

        const newId = reservationCreated.id;

        this.notificationService.success(
          '¡Reserva registrada!',
          `Tu número de reserva es #${newId}`
        );

        this.reservationForm.reset();
        this.tables.forEach((t) => (t.selected = false));
        this.selectedTable = null;
        this.timeSuggestions = [];

        this.router.navigate(['/my-reservations', newId]).then(() => {
          console.log('Redirigido a /my-reservations', newId);
        });
      },
      error: (err) => {
        console.error('Error al registrar reserva:', err);
        const msg =
          err?.error?.message ??
          'No se pudo registrar la reserva, inténtalo más tarde';
        this.notificationService.error('Error', msg);
      },
    });
  }
  searchTimes(event: AutoCompleteCompleteEvent) {
    const q = (event.query ?? '').toString().toLowerCase();
    this.timeSuggestions = this.getAvailableTimesForSelectedTable().filter(
      (t) => t.label.toLowerCase().includes(q)
    );
  }
}
