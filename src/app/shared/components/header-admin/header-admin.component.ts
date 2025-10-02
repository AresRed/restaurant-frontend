import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { UserResponse } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule, ButtonModule, MenuModule],
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss'],
})
export class HeaderAdminComponent {
  items: MenuItem[] = [];
  currentUser: UserResponse | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios del usuario
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.items = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => this.goToProfile(),
      },
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        command: () => this.goToSettings(),
      },
      { separator: true },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  goToProfile() {
    this.router.navigate(['admin/profile']);
  }

  goToSettings() {
    this.router.navigate(['admin/profile/security']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.success('La sesión ha sido cerrada');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.notificationService.error('Error al cerrar sesión', err);
        this.router.navigate(['/home']);
      },
    });
  }
}
