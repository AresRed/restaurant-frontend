import { Routes } from "@angular/router";
import { TablesComponent } from "./page/tables/tables.component";
import { WaiterLayoutComponent } from "./component/waiter-layout/waiter-layout.component";
import { take } from "rxjs";
import { NotificationOrdersComponent } from "./component/notification-orders/notification-orders.component";
import { HistoryOrdersComponent } from "./page/history-orders/history-orders.component"; // Descomentado

export const waiterPage: Routes = [

    {
        path: '',
        component: WaiterLayoutComponent,
        children: [
            { path: '', component: TablesComponent, pathMatch: 'full' }, // Mesas es la ruta por defecto
            { path: 'notificationOrders', component: NotificationOrdersComponent },
            { path: 'historyOrders', component: HistoryOrdersComponent }, // Añadido
        ]
    }
]
