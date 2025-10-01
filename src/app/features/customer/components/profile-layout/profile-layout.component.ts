import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-layout',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss'],
})
export class ProfileLayoutComponent {
  activeSection: string = 'perfil';

  constructor(private router: Router) {}

  navigateTo(section: string) {
    this.router.navigate([`/profile/${section}`]);
  }
}
