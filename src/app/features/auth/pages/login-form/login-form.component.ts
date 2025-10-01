import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UiService } from '../../../../core/services/ui.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiService,
    private notifyService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.uiService.loginDrawerState$.subscribe((opened) => {
      if (opened) this.loginForm.reset();
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { usernameOrEmail, password } = this.loginForm.value;

    this.authService.login({ usernameOrEmail, password }).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success && res.data.accessToken) {
          this.uiService.closeLogin();
          this.notifyService.success(res.message, 'Se ha iniciado sesión');
          this.loginForm.reset();
        } else {
          this.notifyService.error('Login fallido', res.message);
        }
      },
      error: (err) => {
        this.loading = false;
        this.notifyService.error(
          'Error al iniciar sesión',
          'Credenciales inválidas'
        );
      },
    });
  }

  onGoogleLogin() {
    this.loading = true;

    this.authService.loginWithGoogle().subscribe({
      next: (user) => {
        this.uiService.closeLogin();
        this.notifyService.success('Login con Google exitoso');
        this.loginForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.notifyService.error(
          'Error en login con Google',
          err.message || err
        );
        this.loading = false;
      },
    });
  }
}
