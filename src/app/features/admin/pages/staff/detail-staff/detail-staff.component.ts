import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { UserResponse } from '../../../../../core/models/user.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { UserService } from '../../../../../core/services/user.service';
import { RoleLabelPipe } from '../../../../../shared/pipes/role-label.pipe';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-detail-staff',
  standalone: true,
  imports: [CommonModule, RoleLabelPipe, AvatarModule, ButtonModule],
  templateUrl: './detail-staff.component.html',
  styleUrls: ['./detail-staff.component.scss'],
})
export class DetailStaffComponent implements OnInit {
  user?: UserResponse;
  loading = true;
  errorMessage?: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!userId) {
      this.errorMessage = 'ID de usuario inválido';
      this.loading = false;
      return;
    }
    this.loadUser(userId);
  }

  loadUser(id: number) {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (res) => {
        if (res?.data) this.user = res.data;
        else this.errorMessage = 'No se encontró el usuario';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuario';
        this.notificationService.error('Error', err.message || 'API Error');
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/staff']);
  }

  editUser(id: number) {
    this.router.navigate(['/admin/staff/', id, 'edit']);
  }
}
