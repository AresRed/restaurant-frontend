import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export interface ConfirmOptions {
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  icon?: string;
  acceptClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private confirmationService: ConfirmationService) {}

  confirm(options: ConfirmOptions, event?: Event): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        target: event?.currentTarget as EventTarget,
        message: options.message,
        icon: options.icon || 'pi pi-exclamation-triangle',
        acceptLabel: options.acceptLabel || 'Aceptar',
        rejectLabel: options.rejectLabel || 'Cancelar',
        acceptButtonStyleClass: options.acceptClass || 'p-button-primary',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
}
