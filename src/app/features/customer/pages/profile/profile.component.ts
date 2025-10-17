import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { take } from 'rxjs';
import { ApiError } from '../../../../core/models/base/api-response.model';
import { UserResponse } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
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
  avatarPreview: string | null = null;
  isEditing = false;
  isDragging = false;

  profileForm!: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.profileForm = this.fb.group({
        firstName: [
          { value: user?.firstName || '', disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        lastName: [
          { value: user?.lastName || '', disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        email: [
          { value: user?.email || '', disabled: true },
          [Validators.required, Validators.email, Validators.maxLength(100)],
        ],
        username: [
          { value: user?.username || '', disabled: true },
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        phone: [
          { value: user?.phone || '', disabled: true },
          [
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
        newPassword: ['', []],
      });
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
      // Email no editable directamente
      this.profileForm.get('email')?.disable();
    } else {
      this.profileForm.disable();
      if (this.user) this.profileForm.patchValue(this.user);
      this.avatarPreview = null;
    }
  }

  saveChanges() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.notificationService.error(
        'Por favor, corrige los errores del formulario.'
      );
      return;
    }

    const updatedUser: UserResponse = {
      ...this.user!,
      ...this.profileForm.getRawValue(), // getRawValue para obtener email aunque esté disabled
    };

    // Caso especial: usuarios OAuth sin password
    const needsPasswordSetup =
      this.user?.provider !== 'LOCAL' && !this.user?.hasPassword;

    const newPassword = this.profileForm.get('newPassword')?.value;

    // Si el usuario es OAuth y quiere cambiar email => debe tener password
    if (needsPasswordSetup && newPassword && newPassword.trim().length < 6) {
      this.notificationService.warn(
        'La contraseña debe tener al menos 6 caracteres.'
      );
      return;
    }

    // Ejecutar actualización
    const executeUpdate = () => {
      this.userService.updateProfileAuth(updatedUser).subscribe({
        next: (response) => {
          const updated = response.data.user;
          const newToken = response.data.token;

          this.user = updated;
          this.profileForm.patchValue(updated);
          this.profileForm.disable();
          this.avatarPreview = null;
          this.isEditing = false;

          this.authService.setCurrentUser(updated);
          if (newToken) this.authService.setAccessToken(newToken);

          this.notificationService.success('Perfil actualizado correctamente');
        },
        error: (err: HttpErrorResponse) => {
          const apiErr = err.error as ApiError;
          let errorMessage = apiErr?.message || 'Ocurrió un error inesperado';

          if (apiErr?.data) {
            const fieldErrors = Object.values(apiErr.data);
            if (fieldErrors.length) {
              errorMessage += ': ' + fieldErrors.join(', ');
            }
          }

          this.notificationService.error(
            'Error al actualizar perfil',
            errorMessage
          );
        },
      });
    };

    // Si el usuario necesita establecer contraseña primero (OAuth)
    if (needsPasswordSetup && newPassword) {
      this.userService
        .updatePasswordAuth({
          newPassword,
          currentPassword: '',
        })
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Contraseña establecida correctamente'
            );
            executeUpdate();
          },
          error: () => {
            this.notificationService.error('Error al establecer la contraseña');
          },
        });
    } else {
      executeUpdate();
    }
  }

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
    if (!file || !this.user) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarPreview = e.target.result;
    };
    reader.readAsDataURL(file);

    this.userService.updateProfileImageAuth(file).subscribe({
      next: (updated) => {
        this.user = updated.data;
        this.profileForm.patchValue(updated.data);
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

  get usernameDaysLeft(): number | null {
    if (!this.user?.usernameNextChange) return null;
    const now = new Date().getTime();
    const next = new Date(this.user.usernameNextChange).getTime();
    const diff = next - now;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  get emailDaysLeft(): number | null {
    if (!this.user?.emailNextChange) return null;
    const now = new Date().getTime();
    const next = new Date(this.user.emailNextChange).getTime();
    const diff = next - now;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }
}
