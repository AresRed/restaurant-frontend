import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableResponse } from '../../../../../../../../core/models/table.model';
import { NotificationService } from '../../../../../../../../core/services/notification.service';
import { TableService } from '../../../../../../../../core/services/restaurant/table.service';

@Component({
  selector: 'app-dine-in-mode',
  imports: [CommonModule, ProgressSpinnerModule, ButtonModule],
  templateUrl: './dine-in-mode.component.html',
  styleUrl: './dine-in-mode.component.scss',
})
export class DineInModeComponent {
  @Output() next = new EventEmitter<{ dineIn: { tableId: number | null } }>();
  @Output() back = new EventEmitter<void>();

  availableTables: TableResponse[] = [];
  selectedTable: TableResponse | null = null;
  loading = false;

  constructor(
    private tableService: TableService,
    private notificationService: NotificationService
  ) {
    this.loadTables();
  }

  loadTables() {
    this.loading = true;
    this.tableService.getAllTables().subscribe({
      next: (res) => {
        if (res.success) {
          this.availableTables = res.data.filter((t) => t.status === 'FREE');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.notificationService.error(
          'Error',
          'No se pudieron cargar las mesas.'
        );
        this.loading = false;
      },
    });
  }

  selectTable(table: TableResponse) {
    this.selectedTable = table;
  }

  onNext() {
    if (!this.selectedTable) {
      this.notificationService.warn(
        'Por favor selecciona una mesa disponible.'
      );
      return;
    }
    this.next.emit({ dineIn: { tableId: this.selectedTable.id } });
  }
}
