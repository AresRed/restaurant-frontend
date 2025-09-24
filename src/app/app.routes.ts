import { Routes } from '@angular/router';
import { customerRoutes } from './features/customer/customer-routing.module';

export const routes: Routes = [
  ...customerRoutes,
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
