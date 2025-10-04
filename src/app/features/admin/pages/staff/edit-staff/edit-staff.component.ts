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
import { PositionLabelPipe } from '../../../../../shared/pipes/position-label.pipe';

@Component({
  selector: 'app-edit-staff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TooltipModule,
    DatePickerModule,
    TableModule,
    DialogModule,
    PositionLabelPipe,
  ],
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss'],
  providers: [MessageService],
})
export class EditStaffComponent implements OnInit {
  employeeForm: FormGroup;
  scheduleForm: FormGroup;

  employeeId!: number;
  employee?: EmployeeResponse;
  userId?: number;
  positions: PositionResponse[] = [];
  loading = true;
  saving = false;

  // Horarios
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
    // Inicializamos los formularios para evitar undefined
    this.employeeForm = this.fb.group({
      positionId: [null, Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: [null, Validators.required],
      status: [EmploymentStatus.ACTIVE, Validators.required],
    });

    this.scheduleForm = this.fb.group({
      dayOfWeek: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAllData();
    this.loadSchedules();
  }

  // ------------------ Empleado ------------------
  loadAllData() {
    const positions$ = this.positionService.getAllPositions();
    const employee$ = this.employeeService.getEmployeeById(this.employeeId);

    forkJoin([positions$, employee$]).subscribe({
      next: ([posRes, empRes]) => {
        this.positions = posRes?.success ? posRes.data || [] : [];
        this.employee = empRes.data;
        this.userId = this.employee.userId;

        this.employeeForm.patchValue({
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
      userId: this.userId ?? 0,
      positionId: Number(raw.positionId),
      salary: Number(raw.salary),
      hireDate: hireDateStr ?? '',
      status: raw.status,
    };

    this.employeeService
      .updateEmployeeById(this.employeeId, employeeRequest)
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Actualizado',
            'El empleado fue actualizado correctamente.'
          );
          this.saving = false;
          this.router.navigate(['/admin/staff']);
        },
        error: (err) => {
          console.error('Error actualizando empleado', err);
          this.notificationService.error(
            'Error',
            'Ocurrió un error al actualizar el empleado.'
          );
          this.saving = false;
        },
      });
  }

  backToStaff() {
    this.router.navigate(['/admin/staff']);
  }

  private convertToLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // ------------------ Horarios ------------------
  loadSchedules() {
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

  initScheduleForm(schedule?: ScheduleResponse) {
    this.scheduleForm.patchValue({
      dayOfWeek: schedule?.dayOfWeek ?? null,
      startTime: schedule?.startTime ?? '',
      endTime: schedule?.endTime ?? '',
    });
  }

  saveSchedule() {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const raw = this.scheduleForm.value;

    const request: ScheduleRequest = {
      employeeId: this.employeeId,
      dayOfWeek: raw.dayOfWeek,
      startTime: this.formatTimeToString(raw.startTime),
      endTime: this.formatTimeToString(raw.endTime),
    };

    const observable = this.editingSchedule?.id
      ? this.scheduleService.updateSchedule(this.editingSchedule.id, request)
      : this.scheduleService.addSchedule(request);

    observable.subscribe({
      next: () => this.loadSchedules(),
      error: (err: HttpErrorResponse) =>
        this.notificationService.error('Error', err.message),
    });

    this.displayScheduleDialog = false;
  }

  private formatTimeToString(date: Date | string): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = '00'; // siempre 00 segundos
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
