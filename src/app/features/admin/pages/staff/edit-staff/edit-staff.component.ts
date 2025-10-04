import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import {
  EmployeeRequest,
  EmploymentStatus,
} from '../../../../../core/models/employee.model';
import { EmployeeService } from '../../../../../core/services/employee/employee.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-edit-staff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
  ],
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss'],
})
export class EditStaffComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: number;
  loading = true;

  employmentStatuses = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'En licencia', value: 'ON_LEAVE' },
    { label: 'Terminado', value: 'TERMINATED' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required]],
      salary: [0, [Validators.required, Validators.min(0)]],
      positionName: ['', Validators.required],
      positionDescription: [''],
      hireDate: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
    });

    if (this.employeeId) {
      this.loadEmployee();
    }
  }

  loadEmployee() {
    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (res) => {
        const employee = res.data;
        this.employeeForm.patchValue({
          fullName: employee.fullName,
          username: employee.username,
          salary: employee.salary,
          positionName: employee.positionName,
          positionDescription: employee.positionDescription,
          hireDate: new Date(employee.hireDate),
          status: employee.status,
        });
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.error(
          'Error al cargar empleado',
          err.message || err
        );
        this.loading = false;
      },
    });
  }

  save() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.value;
    const request: EmployeeRequest = {
      userId: this.employeeId, // o según tu backend si usas `userId`
      positionId: 1, // si manejas posiciones en otra entidad, ajusta esto
      salary: formValue.salary,
      hireDate: formValue.hireDate.toISOString().split('T')[0],
      status: formValue.status as EmploymentStatus,
    };

    this.employeeService
      .updateEmployeeById(this.employeeId, request)
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Empleado actualizado correctamente'
          );
          this.router.navigate(['/admin/staff']);
        },
        error: (err) => {
          this.notificationService.error(
            'Error al actualizar empleado',
            err.message || err
          );
        },
      });
  }

  backToStaff() {
    this.router.navigate(['/admin/staff']);
  }
}
