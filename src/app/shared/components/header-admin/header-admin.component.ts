import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PopoverModule } from 'primeng/popover';
import { UserResponse } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    PopoverModule,
    DatePipe,
  ],
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss'],
})
export class HeaderAdminComponent {
  @ViewChild('notificationPopover') notificationPopover: any;

  items: MenuItem[] = [];
  currentUser: UserResponse | null = null;

  notifications = [
    {
      title: 'Pedido Nuevo',
      message: 'Tienes un nuevo pedido pendiente',
      date: new Date(),
    },
    {
      title: 'Mensaje Cliente',
      message: 'Juan Pérez te ha enviado un mensaje',
      date: new Date(),
    },
    { title: 'Sistema', message: 'Actualización disponible', date: new Date() },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
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

  toggleNotifications(event: Event) {
    this.notificationPopover.toggle(event);
  }

  viewAllNotifications() {
    console.log('Ir a todas las notificaciones');
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
