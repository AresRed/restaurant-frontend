import { Routes } from '@angular/router';
import { ProfileLayoutComponent } from '../customer/components/profile-layout/profile-layout.component';
import { ProfileComponent } from '../customer/pages/profile/profile.component';
import { SecurityComponent } from '../customer/pages/security/security.component';
import { SettingsComponent } from '../customer/pages/settings/settings.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { FeedbackAndLoyaltyComponent } from './pages/feedback-and-loyalty/feedback-and-loyalty.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { MenuComponent } from './pages/menu/menu.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { StaffComponent } from './pages/staff/staff.component';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'feedback-and-loyalty', component: FeedbackAndLoyaltyComponent },

  // Rutas de perfil/envueltas en ProfileLayout
  {
    path: 'profile',
    component: ProfileLayoutComponent,
    children: [
      { path: '', component: ProfileComponent, pathMatch: 'full' },
      { path: 'security', component: SecurityComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
