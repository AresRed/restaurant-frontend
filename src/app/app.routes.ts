import { Routes } from '@angular/router';
import { HomeComponent } from './features/customer/pages/home/home.component';
import { MenuComponent } from './features/customer/pages/menu/menu.component';
import { WorkUsComponent } from './features/customer/pages/work-us/work-us.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'workus', component: WorkUsComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
