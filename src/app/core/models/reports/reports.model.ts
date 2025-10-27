export interface ProductSalesReportResponse {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface OrderTypeReportResponse {
  orderTypeId: number | null;
  orderTypeName: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface ReportSummaryResponse {
  totalOrders: number;
  totalSales: number;
  ordersToday: number;
  salesToday: number;
  topProducts: ProductSalesReportResponse[];
  orderTypes: OrderTypeReportResponse[];
  salesLast7Days: Record<string, number>;
  ordersLast7Days: Record<string, number>;
}
