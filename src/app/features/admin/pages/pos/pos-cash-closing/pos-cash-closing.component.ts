import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import {
  CashClosingReportResponse,
  CashClosingSubmitRequest,
} from '../../../../../core/models/cash-closing/cash-closing.model';
import { CashClosingService } from '../../../../../core/services/cash-closing/cash-closing.service';
import { NotificationService } from '../../../../../core/services/notification.service';

interface CashClosingReport {
  shiftId: number;
  cashierName: string;
  shiftStartTime: string;
  openingFloat: number;
  totalSales: number;
  totalCashSales: number;
  totalDigitalSales: number;
}

@Component({
  selector: 'app-pos-cash-closing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    ButtonModule,
    InputNumberModule,
    TagModule,
    ProgressSpinnerModule,
    TextareaModule,
  ],
  templateUrl: './pos-cash-closing.component.html',
  styleUrl: './pos-cash-closing.component.scss',
})
export class PosCashClosingComponent implements OnInit {
  isLoading = signal(false);
  isSubmitting = signal(false);

  report = signal<CashClosingReportResponse | null>(null);
  countedCash = signal<number | null>(null);
  notes = signal<string>('');

  paymentMethodKeys = computed(() => {
    if (!this.report()) return [];
    return Object.keys(this.report()!.salesByPaymentMethod);
  });

  totalExpectedCash = computed(() => {
    return this.report()?.expectedCashInDrawer ?? 0;
  });

  cashDifference = computed(() => {
    if (this.countedCash() === null) return 0;
    return this.countedCash()! - this.totalExpectedCash();
  });

  constructor(
    private notificationService: NotificationService,
    private cashClosingService: CashClosingService
  ) {}

  ngOnInit(): void {
    this.loadCurrentShiftReport();
  }

  loadCurrentShiftReport(): void {
    this.isLoading.set(true);
    this.report.set(null);

    this.cashClosingService.getCurrentReport().subscribe({
      next: (response) => {
        this.report.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          err.error?.message || 'No se pudo cargar el reporte de caja.'
        );
        this.isLoading.set(false);
      },
    });
  }

  submitClosing(): void {
    const cash = this.countedCash();

    if (cash === null || cash < 0) {
      this.notificationService.warn(
        'Monto Inválido',
        'Por favor, ingrese el total de efectivo contado (mayor o igual a 0).'
      );
      return;
    }

    this.isSubmitting.set(true);

    const request: CashClosingSubmitRequest = {
      countedCashAmount: this.countedCash()!,
      notes: this.notes() || undefined,
    };

    console.log('Enviando cierre al backend:', request);

    this.cashClosingService.submitCashClosing(request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notificationService.success(
          'Cierre Exitoso',
          `Caja cerrada con una diferencia de ${this.cashDifference().toFixed(
            2
          )}`
        );
        this.report.set(null);
        this.countedCash.set(null);
        this.notes.set('');
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          err.error?.message || 'No se pudo guardar el cierre de caja.'
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
