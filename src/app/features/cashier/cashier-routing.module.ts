import { Routes } from "@angular/router";
import { CashClosingHistoryComponent } from "../admin/pages/pos/cash-closing-history/cash-closing-history.component";
import { PaymentHistoryComponent } from "../admin/pages/payment-history/payment-history.component";
import { PosCashClosingComponent } from "../admin/pages/pos/pos-cash-closing/pos-cash-closing.component";
import { PosComponent } from "../admin/pages/pos/pos.component";
import { OrdersComponent } from "../admin/pages/orders/orders.component";
import { DetailOrderComponent } from "../admin/pages/orders/detail-order/detail-order.component";
import { CashierLayoutComponent } from "../../shared/components/layouts/cashier-layout/cashier-layout.component";

export const cashierPage: Routes = [
  {
    path: '',
    component: CashierLayoutComponent,
    children: [
      { path: '', redirectTo: 'pos', pathMatch: 'full' },
      { path: 'pos', component: PosComponent },
      { path: 'cash-closing', component: PosCashClosingComponent },

      { path: 'cash-closing-history', component: CashClosingHistoryComponent },
      { path: 'payments-history', component: PaymentHistoryComponent },

      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:id', component: DetailOrderComponent },
    ],
  },
];