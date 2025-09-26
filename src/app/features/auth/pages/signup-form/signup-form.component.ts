import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
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
    ReactiveFormsModule
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
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

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
        this.notificationService.error(
          err?.error?.message || 'Error inesperado al registrar'
        );
      },
    });
  }

  onGoogleSignup() {
    this.authService.loginWithGoogle().subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem('refreshToken', res.refreshToken);
        }
        this.notificationService.success('Registro con Google exitoso');
      },
      error: (err) =>
        this.notificationService.error('Error en signup con Google', err),
    });
  }
}
