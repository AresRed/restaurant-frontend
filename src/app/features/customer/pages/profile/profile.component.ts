import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {
  PasswordChangeRequest,
  UserResponse,
} from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';

export interface PasswordChangeRequestWithConfirm
  extends PasswordChangeRequest {
  confirmPassword?: string;
}

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: UserResponse | null = null;
  editableUser: UserResponse | null = null;
  isEditing = false;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      if (user) {
        this.editableUser = { ...user };
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.editableUser = { ...this.user };
    }
  }
  saveChanges() {
    if (!this.editableUser) return;

    this.userService.updateProfileAuth(this.editableUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser.data;
        this.editableUser = { ...updatedUser.data };
        this.authService.setCurrentUser(updatedUser.data);

        this.notificationService.success('Perfil actualizado correctamente');
        this.isEditing = false;
      },
      error: () => {
        this.notificationService.error('Error al actualizar perfil');
      },
    });
  }
}
