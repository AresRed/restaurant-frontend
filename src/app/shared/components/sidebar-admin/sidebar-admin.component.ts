import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ButtonModule } from 'primeng/button';
import { Roles } from '../../../core/models/base/roles.model';
import { AuthService } from '../../../core/services/auth.service';

interface SidebarItem {
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarItem[];
  isOpen?: boolean;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss'],
})
export class SidebarAdminComponent implements OnInit {
  @Input() isOpen = false;
  @Input() isMobile = false;
  @Output() closeSidebar = new EventEmitter<void>();

  companyName = 'San Isidro';
  companyLogo = 'logoB .jpg';

  private allSidebarItems: SidebarItem[] = [
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
        { label: 'Clientes', icon: 'pi pi-users', route: '/admin/customers' },
        {
          label: 'Proveedores',
          icon: 'pi pi-briefcase',
          route: '/admin/suppliers',
          adminOnly: true,
        },
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
          label: 'Promociones',
          icon: 'pi pi-percentage',
          route: '/admin/promotions',
        },
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
          adminOnly: true,
        },
        {
          label: 'Gestionar Lealtad',
          icon: 'pi pi-cog',
          route: '/admin/loyalty-management',
          adminOnly: true,
        },
      ],
    },
  ];

  sidebarItems: SidebarItem[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    const isAdmin =
      this.authService.currentUserValue?.roles.includes(Roles.ROLE_ADMIN) ??
      false;

    if (isAdmin) {
      this.sidebarItems = this.allSidebarItems;
    } else {
      this.sidebarItems = this.allSidebarItems
        .map((item) => this.filterAdminItems(item, isAdmin))
        .filter((item) => item !== null) as SidebarItem[];
    }
  }

  private filterAdminItems(
    item: SidebarItem,
    isAdmin: boolean
  ): SidebarItem | null {
    if (item.adminOnly && !isAdmin) {
      return null;
    }

    if (item.children) {
      const filteredChildren = item.children
        .map((child) => this.filterAdminItems(child, isAdmin))
        .filter((child) => child !== null) as SidebarItem[];
      return { ...item, children: filteredChildren };
    }

    return item;
  }

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
