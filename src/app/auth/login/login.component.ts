import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DrawerModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    FloatLabelModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  visible: boolean = false;
  activeTab: 'login' | 'register' = 'login';

  loginEmail: string = '';
  loginPassword: string = '';

  nombre: string = '';
  regEmail: string = '';
  regPassword = '';
  regPasswordConfirm: string = '';

  currentUser: any | null = null;

  constructor(
    private uiService: UiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.uiService.loginDrawerState$.subscribe(
      (state) => (this.visible = state)
    );

    // Mantener sesión si hay token
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.authService.getCurrentUser().subscribe({
        next: (res) => (this.currentUser = res.data),
        error: () => {
          localStorage.removeItem('accessToken');
          this.currentUser = null;
        },
      });
    }
  }

  onLogin(form: NgForm) {
    if (!form.valid) return;

    this.authService
      .login({ usernameOrEmail: this.loginEmail, password: this.loginPassword })
      .subscribe({
        next: (res) => {
          if (res.data?.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken);
          }
          localStorage.setItem('accessToken', res.data.accessToken);

          this.authService.getCurrentUser().subscribe({
            next: (userRes) => (this.currentUser = userRes.data),
            error: () =>
              (this.currentUser = this.parseJwt(res.data.accessToken)),
          });

          this.visible = false; // cerrar drawer
        },
        error: (err) => console.error('Error al iniciar sesión', err),
      });
  }

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
        next: () => (this.activeTab = 'login'),
        error: (err) => console.error('Error al registrar', err),
      });
  }

  loginGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);

        this.authService.getCurrentUser().subscribe({
          next: (userRes) => {
            this.currentUser = userRes.data;
            this.visible = false; // cerrar drawer
          },
          error: () => {
            this.currentUser = this.parseJwt(res.accessToken); // fallback
          },
        });
      },
      error: (err) => console.error(err),
    });
  }

  parseJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.authService.logout(refreshToken).subscribe({
        next: () => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.currentUser = null;
        },
        error: (err) => console.error('Error al cerrar sesión', err),
      });
    } else {
      localStorage.removeItem('accessToken');
      this.currentUser = null;
    }
  }
}
