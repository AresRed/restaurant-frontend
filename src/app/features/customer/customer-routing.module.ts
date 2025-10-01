import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ProfileLayoutComponent } from './components/profile-layout/profile-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SecurityComponent } from './pages/security/security.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const customerRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu.component').then((m) => m.MenuComponent),
  },
  {
    path: 'reservations',
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CLIENT'] },
    loadComponent: () =>
      import('./pages/reservations/reservations.component').then(
        (m) => m.ReservationsComponent
      ),
  },
  {
    path: 'my-reservations',
    loadComponent: () =>
      import('./pages/my-reservations/my-reservations.component').then(
        (m) => m.MyReservationsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-reservations/:id',
    loadComponent: () =>
      import(
        './pages/my-reservations/reservation-detail/reservation-detail.component'
      ).then((m) => m.ReservationDetailComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: 'workus',
    loadComponent: () =>
      import('./pages/work-us/work-us.component').then(
        (m) => m.WorkUsComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./pages/orders/order-detail/order-detail.component').then(
        (m) => m.OrderDetailComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  {
    path: 'profile',
    component: ProfileLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CLIENT'] },
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', component: ProfileComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'configuration', component: SettingsComponent },
    ],
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./pages/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent
      ),
  },
];
