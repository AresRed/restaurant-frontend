import { Routes } from '@angular/router';
import { ProfileLayoutComponent } from '../customer/components/profile-layout/profile-layout.component';
import { ProfileComponent } from '../customer/pages/profile/profile.component';
import { SecurityComponent } from '../customer/pages/security/security.component';
import { SettingsComponent } from '../customer/pages/settings/settings.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { FeedbackAndLoyaltyComponent } from './pages/feedback-and-loyalty/feedback-and-loyalty.component';
import { AddStockComponent } from './pages/inventory/add-stock/add-stock.component';
import { DetailInventoryComponent } from './pages/inventory/detail-inventory/detail-inventory.component';
import { FormInventoryComponent } from './pages/inventory/form-inventory/form-inventory.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { DetailMenuComponent } from './pages/menu/detail-menu/detail-menu.component';
import { FormMenuComponent } from './pages/menu/form-menu/form-menu.component';
import { MenuComponent } from './pages/menu/menu.component';
import { DetailOrderComponent } from './pages/orders/detail-order/detail-order.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { DetailReservationComponent } from './pages/reservations/detail-reservation/detail-reservation.component';
import { FormReservationComponent } from './pages/reservations/form-reservation/form-reservation.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { DetailStaffComponent } from './pages/staff/detail-staff/detail-staff.component';
import { EditStaffComponent } from './pages/staff/edit-staff/edit-staff.component';
import { StaffComponent } from './pages/staff/staff.component';
import { DetailSupplierComponent } from './pages/suppliers/detail-supplier/detail-supplier.component';
import { FormSupplierComponent } from './pages/suppliers/form-supplier/form-supplier.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'staff/:id', component: DetailStaffComponent },
  { path: 'staff/:id/edit', component: EditStaffComponent },

  { path: 'suppliers', component: SuppliersComponent },
  { path: 'suppliers/create', component: FormSupplierComponent },
  { path: 'suppliers/:id', component: DetailSupplierComponent },
  { path: 'suppliers/:id/edit', component: FormSupplierComponent },

  { path: 'reservations', component: ReservationsComponent },
  { path: 'reservations/create', component: FormReservationComponent },
  { path: 'reservations/:id', component: DetailReservationComponent },
  { path: 'reservations/:id/edit', component: FormReservationComponent },

  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: DetailOrderComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'delivery', component: DeliveryComponent },

  { path: 'inventory', component: InventoryComponent },
  { path: 'inventory/create', component: FormInventoryComponent },
  { path: 'inventory/:id', component: DetailInventoryComponent },
  { path: 'inventory/:id/edit', component: FormInventoryComponent },
  { path: 'inventory/:id/add-stock', component: AddStockComponent },

  { path: 'menu', component: MenuComponent },
  { path: 'menu/create', component: FormMenuComponent },
  { path: 'menu/:id', component: DetailMenuComponent },
  { path: 'menu/:id/edit', component: FormMenuComponent },

  { path: 'feedback-and-loyalty', component: FeedbackAndLoyaltyComponent },

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
