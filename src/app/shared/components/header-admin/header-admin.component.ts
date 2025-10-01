import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-header-admin',
  imports: [AvatarModule, AvatarGroupModule, ButtonModule, MenuModule],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss',
})
export class HeaderAdminComponent {
  items: MenuItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
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
      {
        separator: true,
      },
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
    this.router.navigate(['admin/settings']);
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
