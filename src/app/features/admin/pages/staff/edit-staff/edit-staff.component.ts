import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';

import { InputNumberModule } from 'primeng/inputnumber';
import {
  EmployeeRequest,
  EmployeeResponse,
  EmploymentStatus,
} from '../../../../../core/models/employee/employee.model';
import { PositionResponse } from '../../../../../core/models/employee/position.model';
import {
  DayOfWeekEnum,
  ScheduleRequest,
  ScheduleResponse,
} from '../../../../../core/models/schedule.model';
import { EmployeeService } from '../../../../../core/services/employee/employee.service';
import { PositionService } from '../../../../../core/services/employee/position.service';
import { ScheduleService } from '../../../../../core/services/employee/schedule.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { DayOfWeekNamePipe } from '../../../../../shared/pipes/day-of-week-name.pipe';
import { PositionLabelPipe } from '../../../../../shared/pipes/position-label.pipe';

@Component({
  selector: 'app-edit-staff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    TooltipModule,
    DatePickerModule,
    TableModule,
    DialogModule,
    PositionLabelPipe,
    DayOfWeekNamePipe,
  ],
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss'],
  providers: [MessageService],
})
export class EditStaffComponent implements OnInit {
  employeeForm: FormGroup;
  scheduleForm: FormGroup;

  employeeId: number | null = null;
  employee?: EmployeeResponse;
  userId?: number;
  positions: PositionResponse[] = [];
  loading = true;
  saving = false;
  isEditMode = false;

  schedules: ScheduleResponse[] = [];
  displayScheduleDialog = false;
  editingSchedule?: ScheduleResponse;

  employmentStatuses = [
    { label: 'Activo (trabajando)', value: EmploymentStatus.ACTIVE },
    {
      label: 'En licencia (permiso o descanso)',
      value: EmploymentStatus.ON_LEAVE,
    },
    { label: 'Terminado (ya no trabaja)', value: EmploymentStatus.TERMINATED },
  ];

  daysOfWeek = [
    { label: 'Lunes', value: DayOfWeekEnum.MONDAY },
    { label: 'Martes', value: DayOfWeekEnum.TUESDAY },
    { label: 'Miércoles', value: DayOfWeekEnum.WEDNESDAY },
    { label: 'Jueves', value: DayOfWeekEnum.THURSDAY },
    { label: 'Viernes', value: DayOfWeekEnum.FRIDAY },
    { label: 'Sábado', value: DayOfWeekEnum.SATURDAY },
    { label: 'Domingo', value: DayOfWeekEnum.SUNDAY },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private positionService: PositionService,
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private notificationService: NotificationService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: [''],

      positionId: [null, Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: [null, Validators.required],
      status: [EmploymentStatus.ACTIVE, Validators.required],
    });

    this.scheduleForm = this.fb.group({
      dayOfWeek: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.employeeId = Number(idParam);
      this.loadAllData();
      this.loadSchedules();

      this.employeeForm.get('password')?.clearValidators();
    } else {
      this.isEditMode = false;
      this.loading = false;
      this.loadPositions();

      this.employeeForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(8)]);
    }
  }

  loadPositions() {
    this.positionService.getAllPositions().subscribe({
      next: (posRes) => {
        this.positions = posRes?.success ? posRes.data || [] : [];
      },
      error: (err) => {
        console.error('Error cargando posiciones', err);
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los cargos.'
        );
      },
    });
  }

  loadAllData() {
    if (!this.employeeId) return;

    const positions$ = this.positionService.getAllPositions();
    const employee$ = this.employeeService.getEmployeeById(this.employeeId);

    forkJoin([positions$, employee$]).subscribe({
      next: ([posRes, empRes]) => {
        this.positions = posRes?.success ? posRes.data || [] : [];
        this.employee = empRes.data;

        this.employeeForm.patchValue({
          firstName: this.employee.firstName,
          lastName: this.employee.lastName,
          username: this.employee.username,
          email: this.employee.email,
          phone: this.employee.phone ?? null,
          positionId: this.employee.positionId ?? null,
          salary: this.employee.salary,
          hireDate: this.employee.hireDate
            ? this.convertToLocalDate(this.employee.hireDate)
            : null,
          status: this.employee.status,
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando posiciones/empleado', err);
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los datos del empleado.'
        );
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const raw = this.employeeForm.value;

    let hireDateStr: string | null = null;
    if (raw.hireDate) {
      const dateObj =
        raw.hireDate instanceof Date ? raw.hireDate : new Date(raw.hireDate);
      const local = new Date(
        dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
      );
      hireDateStr = local.toISOString().split('T')[0];
    }

    const employeeRequest: EmployeeRequest = {
      firstName: raw.firstName,
      lastName: raw.lastName,
      username: raw.username,
      email: raw.email,
      phone: raw.phone,
      positionId: Number(raw.positionId),
      salary: Number(raw.salary),
      hireDate: hireDateStr ?? '',
      status: raw.status,
      password: undefined,
    };

    if (!this.isEditMode) {
      employeeRequest.password = raw.password;
    } else {
      delete employeeRequest.password;
    }

    if (this.isEditMode) {
      this.employeeService
        .updateEmployeeById(this.employeeId!, employeeRequest)
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Actualizado',
              'El empleado fue actualizado correctamente.'
            );
            this.saving = false;
            this.router.navigate(['/admin/staff']);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error actualizando empleado', err);
            let errorMsg = 'Ocurrió un error al actualizar el empleado.';

            if (err.error?.message) {
              errorMsg = err.error.message;
              if (err.error.data) {
                const errors = Object.values(err.error.data).join(', ');
                errorMsg += `: ${errors}`;
              }
            } else if (err.message) {
              errorMsg = err.message;
            }

            this.notificationService.error('Error', errorMsg);
            this.saving = false;
          },
        });
    } else {
      this.employeeService.createEmployee(employeeRequest).subscribe({
        next: (res) => {
          this.notificationService.success(
            'Creado',
            'El empleado fue creado correctamente.'
          );
          this.saving = false;
          this.router.navigate(['/admin/staff', res.data.id, 'edit']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creando empleado', err);
          let errorMsg = 'Ocurrió un error al crear el empleado.';

          if (err.error?.message) {
            errorMsg = err.error.message;
            if (err.error.data) {
              const errors = Object.values(err.error.data).join(', ');
              errorMsg += `: ${errors}`;
            }
          }

          this.notificationService.error('Error', errorMsg);
          this.saving = false;
        },
      });
    }
  }

  backToStaff() {
    this.router.navigate(['/admin/staff']);
  }

  private convertToLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  loadSchedules() {
    if (!this.employeeId) return;
    this.scheduleService.getAllSchedules().subscribe({
      next: (res) => {
        this.schedules = res.success
          ? res.data.filter((s) => s.employeeId === this.employeeId)
          : [];
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error('Error', err.message);
      },
    });
  }

  openScheduleDialog(schedule?: ScheduleResponse) {
    this.editingSchedule = schedule;
    this.initScheduleForm(schedule);
    this.displayScheduleDialog = true;
  }

  private stringToTime(timeString: string | null | undefined): Date | null {
    if (!timeString) return null;
    try {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds ?? 0);
      return date;
    } catch (e) {
      console.error('Error convirtiendo string a hora:', timeString, e);
      return null;
    }
  }

  initScheduleForm(schedule?: ScheduleResponse) {
    this.scheduleForm.reset();
    this.scheduleForm.patchValue({
      dayOfWeek: schedule?.dayOfWeek ?? null,
      startTime: this.stringToTime(schedule?.startTime),
      endTime: this.stringToTime(schedule?.endTime),
    });
  }

  saveSchedule() {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    if (!this.employeeId) {
      this.notificationService.error('Error', 'ID de empleado no encontrado.');
      return;
    }

    const raw = this.scheduleForm.value;

    const request: ScheduleRequest = {
      employeeId: this.employeeId!,
      dayOfWeek: raw.dayOfWeek,
      startTime: this.formatTimeToString(raw.startTime),
      endTime: this.formatTimeToString(raw.endTime),
    };

    const observable = this.editingSchedule?.id
      ? this.scheduleService.updateSchedule(this.editingSchedule.id, request)
      : this.scheduleService.addSchedule(request);

    observable.subscribe({
      next: () => {
        this.notificationService.success(
          'Guardado',
          'Horario guardado correctamente.'
        );
        this.loadSchedules();
        this.displayScheduleDialog = false;
        this.editingSchedule = undefined;
      },
      error: (err: HttpErrorResponse) => {
        const errorMsg = err.error?.message || err.message;
        this.notificationService.error('Error', errorMsg);
      },
    });
  }

  private formatTimeToString(date: Date | string | null): string {
    if (!date) return '00:00:00';

    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) {
      console.error('Fecha inválida en formatTimeToString', date);
      return '00:00:00';
    }

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = '00';
    return `${hours}:${minutes}:${seconds}`;
  }

  deleteSchedule(scheduleId: number) {
    this.scheduleService.deleteSchedule(scheduleId).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.success('Horario eliminado');
          this.loadSchedules();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.error('Error', err.message);
      },
    });
  }
}
