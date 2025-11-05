import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { EmployeeResponse } from '../../../../../core/models/employee/employee.model';
import { EmployeeService } from '../../../../../core/services/employee/employee.service';

@Component({
  selector: 'app-assign-driver-modal',
  imports: [CommonModule, TableModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './assign-driver-modal.component.html',
  styleUrl: './assign-driver-modal.component.scss',
})
export class AssignDriverModalComponent implements OnInit {
  drivers: EmployeeResponse[] = [];
  loading = true;

  constructor(
    private employeeService: EmployeeService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.drivers = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  selectDriver(driver: EmployeeResponse) {
    this.ref.close(driver);
  }
}
