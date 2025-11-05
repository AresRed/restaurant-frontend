import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { FeedbackLoyaltySummaryResponse } from '../../../../core/models/feedback-loyalty/feedback-loyalty.model';
import { FeedbackLoyaltyService } from '../../../../core/services/feedback-loyalty/feedback-loyalty.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-feedback-and-loyalty',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    AvatarModule,
  ],
  templateUrl: './feedback-and-loyalty.component.html',
  styleUrls: ['./feedback-and-loyalty.component.scss'],
})
export class FeedbackAndLoyaltyComponent {
  summary?: FeedbackLoyaltySummaryResponse;

  constructor(private feedbackService: FeedbackLoyaltyService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary() {
    this.feedbackService.getFeedbackLoyaltySummary().subscribe({
      next: (res) => {
        if (res.success) {
          this.summary = res.data;
        }
      },
      error: (err) =>
        console.error('Error cargando resumen de feedback y lealtad:', err),
    });
  }
}
