import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { gsap } from 'gsap';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';
import { Roles } from '../../../../core/models/base/roles.model';
import { UserResponse } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';

interface Section {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss'],
})
export class ProfileLayoutComponent implements OnInit, AfterViewInit {
  activeSection: string = '';
  user: UserResponse | null = null;

  isStaffProfile: boolean = false;

  sections: Section[] = [];

  @ViewChildren('menuButton') menuButtons!: QueryList<
    ElementRef<HTMLButtonElement>
  >;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      if (user) {
        const userRoles = new Set(user.roles);
        this.isStaffProfile =
          userRoles.has(Roles.ROLE_ADMIN) ||
          userRoles.has(Roles.ROLE_MANAGER) ||
          userRoles.has(Roles.ROLE_WAITER) ||
          userRoles.has(Roles.ROLE_CHEF) ||
          userRoles.has(Roles.ROLE_CASHIER) ||
          userRoles.has(Roles.ROLE_SUPPLIER);
      } else {
        this.isStaffProfile = false;
      }

      this.setSections();
      this.setActiveSectionFromRoute();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setActiveSectionFromRoute();
      });
  }

  ngOnInit() {
    this.setSections();
  }

  ngAfterViewInit() {
    this.animateMenu();
  }

  setSections() {
    if (this.isStaffProfile) {
      this.sections = [
        { key: '', label: 'Perfil', icon: 'pi pi-user' },
        { key: 'security', label: 'Seguridad', icon: 'pi pi-shield' },
        { key: 'settings', label: 'Configuración', icon: 'pi pi-cog' },
      ];
    } else {
      this.sections = [
        { key: '', label: 'Perfil', icon: 'pi pi-user' },
        { key: 'security', label: 'Seguridad', icon: 'pi pi-shield' },
        { key: 'addresses', label: 'Direcciones', icon: 'pi pi-map-marker' },
        { key: 'orders', label: 'Pedidos', icon: 'pi pi-shopping-cart' },
        { key: 'reservations', label: 'Reservas', icon: 'pi pi-calendar' },
        { key: 'favorites', label: 'Favoritos', icon: 'pi pi-heart' },
        { key: 'reviews', label: 'Reseñas', icon: 'pi pi-star' },
        { key: 'promotions', label: 'Promociones', icon: 'pi pi-tag' },
        { key: 'notifications', label: 'Notificaciones', icon: 'pi pi-bell' },
        { key: 'settings', label: 'Configuración', icon: 'pi pi-cog' },
      ];
    }
  }

  animateMenu() {
    this.menuButtons.forEach((btn, index) => {
      gsap.from(btn.nativeElement, {
        opacity: 1,
        x: -0,
        delay: 0.1 * index,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  }

  setActiveSection(key: string) {
    this.activeSection = key;

    const baseRoute = this.isStaffProfile ? '/admin/profile' : '/profile';
    const route = key ? `${baseRoute}/${key}` : baseRoute;

    this.router.navigate([route]);

    const button = this.menuButtons.find(
      (_, i) => this.sections[i].key === key
    );
    if (button) {
      gsap.fromTo(
        button.nativeElement,
        { scale: 0.95 },
        { scale: 1, duration: 0.2, ease: 'power1.out' }
      );
    }
  }

  private setActiveSectionFromRoute() {
    const url = this.router.url;
    const basePath = this.isStaffProfile ? '/admin/profile' : '/profile';
    let key = url.replace(basePath, '').replace(/^\//, '');
    if (!key) key = '';
    this.activeSection = key;
  }
}
