import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { ReviewCreateRequest } from '../../../../core/models/review.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReviewService } from '../../../../core/services/review/review.service';

@Component({
  selector: 'app-review-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    RatingModule,
    ButtonModule,
    TextareaModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss',
})
export class ReviewModalComponent implements OnChanges {
  @Input() display: boolean = false;
  @Input() resourceId: number | null = null;
  @Input() resourceType: 'order' | 'product' | 'reservation' | null = null;
  @Input() resourceName: string = '';

  @Output() displayChange = new EventEmitter<boolean>();
  @Output() reviewSubmitted = new EventEmitter<void>();

  reviewForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private notificationService: NotificationService
  ) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1)]],
      comment: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['display'] && this.display) {
      this.reviewForm.reset();
      this.isLoading = false;
      this.errorMessage = '';
    }
  }

  closeModal() {
    this.displayChange.emit(false);
  }

  onSubmit() {
    if (this.reviewForm.invalid || !this.resourceId || !this.resourceType) {
      this.errorMessage = 'Por favor, selecciona una calificación.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request: ReviewCreateRequest = {
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment || undefined,
    };

    if (this.resourceType === 'order') {
      request.orderId = this.resourceId;
    } else if (this.resourceType === 'product') {
      request.productId = this.resourceId;
    } else if (this.resourceType === 'reservation') {
      request.reservationId = this.resourceId;
    }

    this.reviewService.createReview(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success(
          '¡Gracias!',
          'Reseña enviada correctamente'
        );
        this.reviewSubmitted.emit();
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.message?.includes('Ya has enviado una reseña')) {
          this.errorMessage = 'Ya has calificado este ítem.';
        } else {
          this.errorMessage = 'Error al enviar la reseña. Inténtalo de nuevo.';
        }
        console.error(err);
      },
    });
  }
}
