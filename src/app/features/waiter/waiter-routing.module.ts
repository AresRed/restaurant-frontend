import { Routes } from '@angular/router';
import { NotificationOrdersComponent } from './component/notification-orders/notification-orders.component';
import { WaiterLayoutComponent } from './component/waiter-layout/waiter-layout.component';
import { HistoryOrdersComponent } from './page/history-orders/history-orders.component';
import { TablesComponent } from './page/tables/tables.component';

export const waiterPage: Routes = [
  {
    path: '',
    component: WaiterLayoutComponent,
    children: [
      { path: '', component: TablesComponent, pathMatch: 'full' },
      { path: 'notificationOrders', component: NotificationOrdersComponent },
      { path: 'historyOrders', component: HistoryOrdersComponent },
    ],
  },
];
