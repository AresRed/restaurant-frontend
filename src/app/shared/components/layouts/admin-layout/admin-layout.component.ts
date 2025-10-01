import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { SidebarAdminComponent } from '../../sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-admin-layout',
  imports: [HeaderAdminComponent, RouterOutlet, SidebarAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {}
