import { Routes } from "@angular/router";
import { TablesComponent } from "./page/tables/tables.component";
import { WaiterLayoutComponent } from "./component/waiter-layout/waiter-layout.component";
import { take } from "rxjs";
import { NotificationOrdersComponent } from "./component/notification-orders/notification-orders.component";
import { OrdersComponent } from "./page/orders/orders.component";

export const waiterPage: Routes = [

    {
        path: 'waiter',
        component: WaiterLayoutComponent,
        children: [
            { path: '', component: TablesComponent, pathMatch: 'full' },
            { path: 'notificationOrders', component: NotificationOrdersComponent },
            { path: 'orders', component: OrdersComponent }
        ]
    }
]