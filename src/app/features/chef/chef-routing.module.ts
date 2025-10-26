import { Routes } from "@angular/router";
import { ChefLayoutComponent } from "./component/chef-layout/chef-layout.component";
import { KitchenOrdersComponent } from "./page/kitchen-orders/kitchen-orders.component";
import { NotificationKitchenComponent } from "./component/notification-kitchen/notification-kitchen.component";

export const chefPage: Routes = [

    {
        path:'chef',
        component:ChefLayoutComponent,
        children:[
            {path: '',component:KitchenOrdersComponent,pathMatch:'full'},
            {path: 'notificaciontKitchen',component:NotificationKitchenComponent}
        ]
    }
    
]