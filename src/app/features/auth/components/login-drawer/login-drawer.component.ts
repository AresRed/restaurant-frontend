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

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.closeDrawer();
      }
    });
  }

  closeDrawer() {
    this.uiService.closeLogin();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
