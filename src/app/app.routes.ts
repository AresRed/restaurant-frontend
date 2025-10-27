import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { adminRoutes } from './features/admin/admin-routing.module';
import { customerRoutes } from './features/customer/customer-routing.module';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './shared/components/layouts/user-layout/user-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: customerRoutes,
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: adminRoutes,
  },
  {
    path: 'chef',
    loadChildren: () => import('./features/chef/chef-routing.module').then(m => m.chefPage),
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CHEF'] }
  },
  {
    path: 'waiter',
    loadChildren: () => import('./features/waiter/waiter-routing.module').then(m => m.waiterPage),
    data: { roles: ['ROLE_WAITER'] }
  },

  {
    path: 'cashier',
    loadChildren: () => import('./features/cashier/cashier-routing.module').then(m => m.cashierPage),
    data:{roles:['ROLE_CASHIER']}
  },








  { path: '**', redirectTo: '/home' },
];
