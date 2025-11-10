import { Routes } from '@angular/router';
import { AddStockComponent } from '../admin/pages/inventory/add-stock/add-stock.component';
import { DetailInventoryComponent } from '../admin/pages/inventory/detail-inventory/detail-inventory.component';
import { FormInventoryComponent } from '../admin/pages/inventory/form-inventory/form-inventory.component';
import { InventoryComponent } from '../admin/pages/inventory/inventory.component';
import { ChefLayoutComponent } from './component/chef-layout/chef-layout.component';
import { NotificationKitchenComponent } from './component/notification-kitchen/notification-kitchen.component';
import { KitchenOrdersComponent } from './page/kitchen-orders/kitchen-orders.component';

export const chefPage: Routes = [
  {
    path: '',
    component: ChefLayoutComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: KitchenOrdersComponent },
      { path: 'notifications', component: NotificationKitchenComponent },

      { path: 'inventory', component: InventoryComponent },
      { path: 'inventory/create', component: FormInventoryComponent },
      { path: 'inventory/:id', component: DetailInventoryComponent },
      { path: 'inventory/:id/edit', component: FormInventoryComponent },
      { path: 'inventory/:id/add-stock', component: AddStockComponent },
    ],
  },
];
