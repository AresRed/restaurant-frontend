import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth.service';

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
  ],
  templateUrl: './signup-form.component.html',
})
export class SignupFormComponent {
  nombre = '';
  regEmail = '';
  regPassword = '';
  regPasswordConfirm = '';

  constructor(private authService: AuthService) {}

  onRegister(form: NgForm) {
    if (!form.valid) return;
    if (this.regPassword !== this.regPasswordConfirm) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    this.authService
      .register({
        username: this.nombre,
        email: this.regEmail,
        password: this.regPassword,
      })
      .subscribe({
        next: () => console.log('✅ Usuario registrado'),
        error: (err) => console.error('Error al registrar', err),
      });
  }

  onGoogleSignup() {
    this.authService.loginWithGoogle().subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem('refreshToken', res.refreshToken);
        }
        console.log('✅ Registro con Google exitoso');
      },
      error: (err) => console.error('❌ Error en signup con Google', err),
    });
  }
}
