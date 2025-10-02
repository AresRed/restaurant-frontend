import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserResponse } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  avatarPreview: string | null = null;
  isDragging = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      if (user) {
        this.editableUser = { ...user };
        this.avatarPreview = null;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.editableUser = { ...this.user };
      this.avatarPreview = null;
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
        this.avatarPreview = null;
      },
      error: () => {
        this.notificationService.error('Error al actualizar perfil');
      },
    });
  }

  // Drag & Drop handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (!this.isEditing) return;
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    if (!this.isEditing) return;
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.isEditing) return;
    this.isDragging = false;

    if (!event.dataTransfer || !event.dataTransfer.files.length) return;
    const file = event.dataTransfer.files[0];
    this.uploadFile(file);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    if (!file || !this.editableUser) return;

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarPreview = e.target.result;
    };
    reader.readAsDataURL(file);

    // Subir al backend
    this.userService.updateProfileImageAuth(file).subscribe({
      next: (updated) => {
        this.user = updated.data;
        this.editableUser = { ...updated.data };
        this.avatarPreview = null;
        this.authService.setCurrentUser(updated.data);
        this.notificationService.success(
          'Imagen de perfil actualizada correctamente'
        );
      },
      error: () => {
        this.notificationService.error('Error al subir la imagen de perfil');
      },
    });
  }
}
