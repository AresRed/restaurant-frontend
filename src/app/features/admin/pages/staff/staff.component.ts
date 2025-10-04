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
import { roleLabels } from '../../../../core/models/base/roles.model';
import {
  DayOfWeekEnum,
  ScheduleResponse,
} from '../../../../core/models/schedule.model';
import { UserResponse } from '../../../../core/models/user.model';
import { ScheduleService } from '../../../../core/services/employee/schedule.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';
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
  ],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent implements OnInit {
  staffList: UserResponse[] = [];
  schedules: ScheduleResponse[] = [];
  schedulesByDay: ScheduleByDay[] = [];
  showTable = false;

  chartData: any;
  chartOptions: any;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    };
  }

  ngOnInit() {
    this.loadPersonal();
    this.loadSchedules();
  }

  loadPersonal() {
    this.userService.getAllPersonalForAdmin().subscribe({
      next: (res) => {
        if (res.success) {
          this.staffList = res.data;

          const roleCounts: Record<string, number> = {};
          this.staffList.forEach((s) => {
            s.roles.forEach((role) => {
              const label = roleLabels[role as keyof typeof roleLabels] || role;
              roleCounts[label] = (roleCounts[label] || 0) + 1;
            });
          });

          this.chartData = {
            labels: Object.keys(roleCounts), // ahora son las etiquetas legibles
            datasets: [
              {
                data: Object.values(roleCounts),
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
            day: this.capitalizeDay(day),
            schedules: this.schedules.filter((s) => s.dayOfWeek === day),
          }));
        }
      },
      error: (err) => {
        this.notificationService.error('Error', err.message);
      },
    });
  }

  viewDetails(user: UserResponse) {
    if (!user.id) return
    this.router.navigate(['/admin/staff', user.id]);
  }

  editStaff(user: UserResponse) {
    if (!user.id) return;
    this.router.navigate(['/admin/staff', user.id, 'edit']);
  }

  capitalizeDay(day: string): string {
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  }

  formatHour(time: string): string {
    const [h, m] = time.split(':');
    return `${h}:${m}`;
  }

  getEmployeeColorClass(employeeId: number): string {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-teal-500',
    ];
    return colors[employeeId % colors.length] + ' text-white';
  }
}
