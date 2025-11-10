import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CashClosingSessionResponse } from '../../../../../core/models/cash-closing/cash-closing.model';
import { CashClosingService } from '../../../../../core/services/cash-closing/cash-closing.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-cash-closing-history',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CurrencyPipe,
    DatePipe,
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './cash-closing-history.component.html',
  styleUrl: './cash-closing-history.component.scss',
})
export class CashClosingHistoryComponent implements OnInit {
  isLoading = signal(false);
  sessions = signal<CashClosingSessionResponse[]>([]);

  constructor(
    private cashClosingService: CashClosingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading.set(true);
    this.cashClosingService.getHistory().subscribe({
      next: (response) => {
        if (response.success) {
          this.sessions.set(response.data);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          err.error?.message || 'No se pudo cargar el historial.'
        );
        this.isLoading.set(false);
      },
    });
  }

  getDifferenceSeverity(difference: number) {
    if (difference === 0) return 'info';
    if (difference > 0) return 'success';
    return 'danger';
  }

  getDifferenceLabel(difference: number): string {
    if (difference === 0) return 'CUADRADO';
    if (difference > 0) return 'SOBRANTE';
    return 'FALTANTE';
  }
}
