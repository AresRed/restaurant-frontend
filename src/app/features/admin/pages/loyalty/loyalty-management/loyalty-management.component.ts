import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import {
  RewardRequest,
  RewardResponse,
} from '../../../../../core/models/reward/reward.model';
import { ConfirmService } from '../../../../../core/services/confirmation.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { RewardService } from '../../../../../core/services/reward/reward.service';

@Component({
  selector: 'app-loyalty-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    InputSwitchModule,
  ],
  templateUrl: './loyalty-management.component.html',
  styleUrl: './loyalty-management.component.scss',
  providers: [ConfirmationService],
})
export class LoyaltyManagementComponent implements OnInit {
  isLoading = signal(false);
  isSubmitting = signal(false);
  rewards = signal<RewardResponse[]>([]);

  displayModal = signal(false);
  isEditMode = signal(false);
  currentRewardId = signal<number | null>(null);
  rewardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rewardService: RewardService,
    private notificationService: NotificationService,
    private confirmService: ConfirmService
  ) {
    this.rewardForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(255)],
      requiredPoints: [null, [Validators.required, Validators.min(1)]],
      active: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards(): void {
    this.isLoading.set(true);
    this.rewardService.getAllRewards().subscribe({
      next: (res) => {
        this.rewards.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.notificationService.error(
          'Error',
          'No se pudieron cargar las recompensas.'
        );
        this.isLoading.set(false);
      },
    });
  }

  openNewRewardModal(): void {
    this.isEditMode.set(false);
    this.currentRewardId.set(null);
    this.rewardForm.reset({ active: true, requiredPoints: 1 });
    this.displayModal.set(true);
  }

  openEditRewardModal(reward: RewardResponse): void {
    this.isEditMode.set(true);
    this.currentRewardId.set(reward.id);
    this.rewardForm.patchValue(reward);
    this.displayModal.set(true);
  }

  hideModal(): void {
    this.displayModal.set(false);
  }

  onSaveReward(): void {
    if (this.rewardForm.invalid) {
      this.notificationService.warn(
        'Datos incompletos',
        'Revise los campos marcados en rojo.'
      );
      return;
    }

    this.isSubmitting.set(true);
    const request: RewardRequest = this.rewardForm.value;

    if (this.isEditMode() && this.currentRewardId()) {
      this.rewardService
        .updateReward(this.currentRewardId()!, request)
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Éxito',
              'Recompensa actualizada.'
            );
            this.hideModal();
            this.loadRewards();
            this.isSubmitting.set(false);
          },
          error: (err) => {
            this.notificationService.error(
              'Error',
              err.error?.message || 'No se pudo actualizar.'
            );
            this.isSubmitting.set(false);
          },
        });
    } else {
      this.rewardService.createReward(request).subscribe({
        next: () => {
          this.notificationService.success('Éxito', 'Recompensa creada.');
          this.hideModal();
          this.loadRewards();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            err.error?.message || 'No se pudo crear.'
          );
          this.isSubmitting.set(false);
        },
      });
    }
  }

  async onDeleteReward(reward: RewardResponse, event: Event): Promise<void> {
    const confirmed = await this.confirmService.confirm(
      {
        message: `¿Está seguro de que desea eliminar la recompensa "${reward.name}"? Esta acción no se puede deshacer.`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        rejectClass: 'p-button-text',
      },
      event
    ); // 👈 2. Pasa el 'event' a tu servicio

    if (confirmed) {
      this.isLoading.set(true);

      this.rewardService.deleteReward(reward.id).subscribe({
        next: () => {
          this.notificationService.success('Éxito', 'Recompensa eliminada.');
          this.loadRewards();
        },
        error: (err) => {
          this.notificationService.error(
            'Error',
            err.error?.message || 'No se pudo eliminar.'
          );
          this.isLoading.set(false);
        },
      });
    }
  }
}
