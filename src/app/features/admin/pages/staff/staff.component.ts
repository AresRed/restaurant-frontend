import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';

interface Staff {
  id: number;
  name: string;
  role: string;
  photo?: string;
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
  ],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent {
  staffList: Staff[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      role: 'Chef Principal',
      photo: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 2,
      name: 'María López',
      role: 'Mesera',
      photo: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 3,
      name: 'Carlos Díaz',
      role: 'Bartender',
      photo: 'https://i.pravatar.cc/150?img=20',
    },
    {
      id: 4,
      name: 'Ana Torres',
      role: 'Mesera',
      photo: 'https://i.pravatar.cc/150?img=32',
    },
  ];

  // Switch entre Cards y Tabla
  showTable = false;

  // Datos de horarios (mock)
  schedules = [
    { day: 'Lunes', shift: '10:00 - 18:00', staff: 'Juan Pérez' },
    { day: 'Martes', shift: '14:00 - 22:00', staff: 'María López' },
    { day: 'Miércoles', shift: '10:00 - 18:00', staff: 'Carlos Díaz' },
    { day: 'Jueves', shift: '14:00 - 22:00', staff: 'Ana Torres' },
    { day: 'Viernes', shift: '10:00 - 18:00', staff: 'Juan Pérez' },
  ];

  // Gráfico distribución de roles
  chartData: any;
  chartOptions: any;

  constructor() {
    const roleCounts = this.getRoleDistribution();
    this.chartData = {
      labels: Object.keys(roleCounts),
      datasets: [
        {
          data: Object.values(roleCounts),
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63'],
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    };
  }

  getRoleDistribution() {
    const distribution: Record<string, number> = {};
    this.staffList.forEach((s) => {
      distribution[s.role] = (distribution[s.role] || 0) + 1;
    });
    return distribution;
  }

  viewDetails(staff: Staff) {
    console.log('Ver detalles:', staff);
  }

  editStaff(staff: Staff) {
    console.log('Editar staff:', staff);
  }
}
