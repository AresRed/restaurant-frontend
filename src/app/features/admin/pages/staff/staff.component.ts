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
    TooltipModule,
    PositionLabelPipe,
  ],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  providers: [PositionLabelPipe], // 👈 agrega esto
})
export class StaffComponent implements OnInit {
  staffList: EmployeeResponse[] = [];
  schedules: ScheduleResponse[] = [];
  schedulesByDay: ScheduleByDay[] = [];
  hours = Array.from({ length: 13 }, (_, i) => i + 8);
  showTable = false;

  chartData: any;
  chartOptions: any;

  dayNamesMap: Record<DayOfWeekEnum, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private scheduleService: ScheduleService,
    private router: Router,
    private positionLabelPipe: PositionLabelPipe // 👈 inyección del pipe
  ) {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#374151',
            font: { size: 14, family: 'Inter, sans-serif' },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.chart._metasets[0].total;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
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

          const positionCounts: Record<string, number> = {};
          this.staffList.forEach((s) => {
            const key = s.positionName || 'Sin cargo';
            positionCounts[key] = (positionCounts[key] || 0) + 1;
          });

          // 👇 aplicar el pipe aquí
          const labels = Object.keys(positionCounts).map((key) =>
            this.positionLabelPipe.transform(key)
          );

          this.chartData = {
            labels,
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
                borderColor: '#fff',
                borderWidth: 2,
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

  formatHour(time: string): string {
    const [h, m] = time.split(':');
    return `${h}:${m}`;
  }

  getEmployeeColorClass(employeeId: number): string {
    const colors = ['bg-green-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[employeeId % colors.length] + ' text-white';
  }
}
