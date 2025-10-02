import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

interface SidebarItem {
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss'],
})
export class SidebarAdminComponent {
  @Input() isOpen = false;
  @Input() isMobile = false;
  @Output() closeSidebar = new EventEmitter<void>();

  companyName = 'San Isidro';
  companyLogo = 'favicon.ico';

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/admin/dashboard' },
    {
      label: 'Gestión',
      icon: 'pi pi-cog',
      isOpen: true,
      children: [
        {
          label: 'Ordenes',
          icon: 'pi pi-shopping-cart',
          route: '/admin/orders',
        },
        { label: 'Inventario', icon: 'pi pi-box', route: '/admin/inventory' },
        { label: 'Personal', icon: 'pi pi-users', route: '/admin/staff' },
      ],
    },
    {
      label: 'Operaciones',
      icon: 'pi pi-briefcase',
      isOpen: true,
      children: [
        {
          label: 'Reportes',
          icon: 'pi pi-chart-line',
          route: '/admin/reports',
        },
        { label: 'Menú', icon: 'pi pi-list', route: '/admin/menu' },
        {
          label: 'Reservaciones',
          icon: 'pi pi-calendar',
          route: '/admin/reservations',
        },
        { label: 'Delivery', icon: 'pi pi-truck', route: '/admin/delivery' },
        {
          label: 'Feedback & Lealtad',
          icon: 'pi pi-comments',
          route: '/admin/feedback-and-loyalty',
        },
      ],
    },
  ];

  constructor(public authService: AuthService) {}

  toggleSubmenu(item: SidebarItem, submenuEl: HTMLElement) {
    const el = submenuEl;
    const isOpen = !!item.isOpen;
    const fullHeight = el.scrollHeight;

    if (isOpen) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    } else {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: fullHeight,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            el.style.height = 'auto';
          },
        }
      );
    }

    item.isOpen = !isOpen;
  }
  close() {
    if (this.isMobile) this.closeSidebar.emit();
  }
}
