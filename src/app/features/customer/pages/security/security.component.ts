import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import {
  UserResponse,
  UserSessionResponse,
} from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';
import { TableModule } from 'primeng/table';

export interface PasswordChangeRequestWithConfirm {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PasswordModule,
    ButtonModule,
    TableModule,
  ],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  currentUser: UserResponse | null = null;
  sessions: UserSessionResponse[] = [];

  passwords: PasswordChangeRequestWithConfirm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadSessions();
  }

  hasPassword(): boolean {
    if (!this.currentUser) return false;
    return (
      this.currentUser.provider === 'LOCAL' ||
      this.currentUser.hasPassword === true
    );
  }

  changePassword() {
    const isCreatingPassword =
      this.currentUser?.provider !== 'LOCAL' && !this.hasPassword();

    // Validaciones
    if (!this.passwords.newPassword) {
      this.notificationService.error('La nueva contraseña es obligatoria');
      return;
    }

    if (this.passwords.newPassword !== this.passwords.confirmPassword) {
      this.notificationService.error('Las contraseñas no coinciden');
      return;
    }

    if (!isCreatingPassword && !this.passwords.currentPassword) {
      this.notificationService.error('Debes ingresar tu contraseña actual');
      return;
    }

    this.userService.updatePasswordAuth(this.passwords).subscribe({
      next: () => {
        this.notificationService.success(
          isCreatingPassword
            ? 'Contraseña creada correctamente'
            : 'Contraseña actualizada correctamente'
        );

        this.passwords = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        };

        this.authService.getCurrentUser().subscribe({
          next: (res) => {
            if (res.success && res.data) {
              this.currentUser = res.data;
              this.notificationService.success('Datos de usuario actualizados');
            }
          },
          error: () => {
            this.notificationService.error(
              'No se pudo actualizar la información del usuario'
            );
          },
        });
      },
      error: (err) =>
        this.notificationService.error(
          err.error?.message || 'Error al actualizar la contraseña'
        ),
    });
  }

  loadSessions() {
    this.userService.getSessionsAuth().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.sessions = res.data.map((s) => ({
            ...s,
            expiryDate: new Date(s.expiryDate),
          }));
        }
      },
      error: (err) => {
        this.notificationService.error('No se pudieron cargar las sesiones');
      },
    });
  }

  logoutCurrentSession() {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.success('Sesión cerrada');
      },
      error: () =>
        this.notificationService.error('No se pudo cerrar la sesión'),
    });
  }

  logoutOtherSession(sessionId: string) {
    if (!sessionId) return;

    this.authService.logout(sessionId).subscribe({
      next: () => {
        this.notificationService.success('Sesión cerrada');
        this.loadSessions();
      },
      error: () =>
        this.notificationService.error('No se pudo cerrar la sesión'),
    });
  }
}
