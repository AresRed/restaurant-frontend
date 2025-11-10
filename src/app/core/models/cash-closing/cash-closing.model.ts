export interface CashClosingSubmitRequest {
  countedCashAmount: number;
  notes?: string;
}

export interface CashClosingReportResponse {
  cashierName: string;
  shiftStartTime: string;
  openingBalance: number;
  salesByPaymentMethod: Record<string, number>;
  totalSales: number;
  expectedCashInDrawer: number;
}

export interface CashClosingSessionResponse {
  id: number;
  employeeName: string;
  closingTime: string;
  openingBalance: number;
  salesByPaymentMethod: Record<string, number>;
  expectedCash: number;
  countedCash: number;
  difference: number;
  notes: string;
}
