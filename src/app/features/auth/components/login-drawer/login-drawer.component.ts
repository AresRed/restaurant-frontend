import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { UiService } from '../../../../core/services/ui.service';
import { LoginFormComponent } from '../../pages/login-form/login-form.component';
import { SignupFormComponent } from '../../pages/signup-form/signup-form.component';

@Component({
  selector: 'app-login-drawer',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    ButtonModule,
    LoginFormComponent,
    SignupFormComponent,
  ],
  templateUrl: './login-drawer.component.html',
})
export class LoginDrawerComponent implements OnInit, OnDestroy {
  visible = false;
  activeTab: 'login' | 'register' = 'login';
  currentUser: any | null = null;
  private sub: Subscription | null = null;

  constructor(private uiService: UiService, private authService: AuthService) {}

  ngOnInit() {
    this.sub = this.uiService.loginDrawerState$.subscribe((state) => {
      this.visible = state.visible;
      this.activeTab = state.tab;
    });

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

  closeDrawer() {
    this.uiService.closeLogin();
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
