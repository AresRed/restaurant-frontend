import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
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
export class SidebarAdminComponent implements AfterViewInit {
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

  companyName = 'San Isidro';
  companyLogo = 'favicon.ico'; // ruta del logo

  constructor(public authService: AuthService) {}

  ngAfterViewInit() {
    // Animación inicial más suave
    setTimeout(() => {
      this.sidebarItems.forEach((item, index) => {
        if (item.children && item.isOpen) {
          const submenuEl = document.querySelectorAll<HTMLElement>(
            '#submenu-' + index
          )[0];
          if (submenuEl) {
            const fullHeight = submenuEl.scrollHeight;
            gsap.set(submenuEl, { height: fullHeight, opacity: 1 });
            submenuEl.style.height = 'auto';
          }
        }
      });
    }, 0);
  }

  toggleSubmenu(item: SidebarItem, submenuEl: HTMLElement) {
    const isOpen = !!item.isOpen;
    const fullHeight = submenuEl.scrollHeight;

    if (isOpen) {
      // Animación premium de cierre: slide + fade out + suavizado
      gsap.to(submenuEl, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    } else {
      // Animación premium de apertura: slide + fade in + suavizado
      gsap.fromTo(
        submenuEl,
        { height: 0, opacity: 0 },
        {
          height: fullHeight,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            submenuEl.style.height = 'auto';
          },
        }
      );
    }

    item.isOpen = !isOpen;
  }
}
