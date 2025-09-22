import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth.service';
import { UiService } from '../../../../core/services/ui.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  loginEmail = '';
  loginPassword = '';

  constructor(private authService: AuthService, private uiService: UiService) {}

  onLogin(form: NgForm) {
    if (!form.valid) return;

    this.authService
      .login({ usernameOrEmail: this.loginEmail, password: this.loginPassword })
      .subscribe({
        next: (res) => {
          localStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }
        },
        error: (err) => console.error('Error al iniciar sesión', err),
      });
  }

  onGoogleLogin() {
    this.authService.loginWithGoogle().subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem('refreshToken', res.refreshToken);
        }
        console.log('✅ Login con Google exitoso');
      },
      error: (err) => console.error('❌ Error en login con Google', err),
    });
  }
  
}
