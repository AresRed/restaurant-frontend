import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { EmployeeResponse } from '../../../../core/models/employee/employee.model';
import {
  DayOfWeekEnum,
  ScheduleResponse,
} from '../../../../core/models/schedule.model';
import { EmployeeService } from '../../../../core/services/employee/employee.service';
import { ScheduleService } from '../../../../core/services/employee/schedule.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PositionLabelPipe } from '../../../../shared/pipes/position-label.pipe';
import { RoleLabelPipe } from '../../../../shared/pipes/role-label.pipe';

interface ScheduleByDay {
  day: string;
  schedules: ScheduleResponse[];
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    TableModule,
    ToggleButtonModule,
    ChartModule,
    RoleLabelPipe,
    TooltipModule,
    PositionLabelPipe,
  ],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent implements OnInit {
  staffList: EmployeeResponse[] = [];
  schedules: ScheduleResponse[] = [];
  schedulesByDay: ScheduleByDay[] = [];
  hours = Array.from({ length: 13 }, (_, i) => i + 8);
  dayNamesMap: Record<DayOfWeekEnum, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  showTable = false;

  chartData: any;
  chartOptions: any;

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    };
  }

  ngOnInit() {
    this.loadPersonal();
    this.loadSchedules();
  }

  loadPersonal() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        if (res.success) {
          this.staffList = res.data;

          // Generar gráfico: distribución por cargo
          const positionCounts: Record<string, number> = {};
          this.staffList.forEach((s) => {
            const label = s.positionName || 'Sin cargo';
            positionCounts[label] = (positionCounts[label] || 0) + 1;
          });

          this.chartData = {
            labels: Object.keys(positionCounts),
            datasets: [
              {
                data: Object.values(positionCounts),
                backgroundColor: [
                  '#4CAF50',
                  '#2196F3',
                  '#FF9800',
                  '#E91E63',
                  '#9C27B0',
                  '#FFC107',
                ],
              },
            ],
          };
        }
      },
      error: (err) => {
        this.notificationService.error('Error', err.message);
      },
    });
  }

  loadSchedules() {
    this.scheduleService.getAllSchedules().subscribe({
      next: (res) => {
        if (res.success) {
          this.schedules = res.data;
          const daysOfWeek = Object.values(DayOfWeekEnum);

          this.schedulesByDay = daysOfWeek.map((day) => ({
            day: this.dayNamesMap[day],
            schedules: this.schedules.filter((s) => s.dayOfWeek === day),
          }));
        }
      },
      error: (err) => {
        this.notificationService.error('Error', err.message);
      },
    });
  }

  viewDetails(employee: EmployeeResponse) {
    if (!employee.id) return;
    this.router.navigate(['/admin/staff', employee.id]);
  }

  editStaff(employee: EmployeeResponse) {
    if (!employee.id) return;
    this.router.navigate(['/admin/staff', employee.id, 'edit']);
  }

  capitalizeDay(day: string): string {
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  }

  formatHour(time: string): string {
    const [h, m] = time.split(':');
    return `${h}:${m}`;
  }

  getEmployeeColorClass(employeeId: number): string {
    const colors = ['bg-green-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[employeeId % colors.length] + ' text-white';
  }
}
