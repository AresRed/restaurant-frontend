import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ApiError } from '../../../../core/models/base/api-response.model';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UiService } from '../../../../core/services/ui.service';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup-form.component.html',
})
export class SignupFormComponent {
  signupForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private uiService: UiService
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ✅ Arrow function — mantiene el contexto correctamente
  passwordMatchValidator = (group: FormGroup) => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  };

  onRegister() {
    if (this.signupForm.invalid) return;

    this.loading = true;
    this.authService.register(this.signupForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.notificationService.success(res.message || 'Usuario registrado');
          this.signupForm.reset();
          this.uiService.openLogin();
        } else {
          this.notificationService.error(res.message || 'Error al registrar');
        }
      },
      error: (err) => {
        this.loading = false;

        const apiError: ApiError = err?.error;
        const generalMessage =
          apiError?.message || 'Error inesperado al registrar';

        this.notificationService.error(generalMessage);

        if (apiError?.data) {
          Object.entries(apiError.data).forEach(([field, message]) => {
            const control = this.signupForm.get(field);
            if (control) {
              control.setErrors({ apiError: message });
              control.markAsTouched();
            }
          });
        }
      },
    });
  }

  onGoogleSignup() {
    this.loading = true;

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.uiService.closeSignup();
        this.notificationService.success('Registro con Google exitoso');
        this.signupForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.error(
          'Error en signup con Google',
          err.message || err
        );
        this.loading = false;
      },
    });
  }
}
