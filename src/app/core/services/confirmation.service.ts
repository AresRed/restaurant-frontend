import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export interface ConfirmOptions {
  header?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  icon?: string;
  acceptClass?: string;
  rejectClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private confirmationService: ConfirmationService) {}

  confirm(options: ConfirmOptions, event?: Event): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        header: options.header,
        target: event?.currentTarget as EventTarget,
        message: options.message,
        icon: options.icon || 'pi pi-exclamation-triangle',
        acceptLabel: options.acceptLabel || 'Aceptar',
        rejectLabel: options.rejectLabel || 'Cancelar',
        acceptButtonStyleClass: options.acceptClass || 'p-button-primary',
        rejectButtonStyleClass: options.rejectClass,
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
}
