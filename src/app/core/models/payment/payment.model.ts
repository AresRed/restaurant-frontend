export interface OnlineCheckoutRequest {
  orderId: number;
  transactionAmount: number;
  installments: number;
  token: string;
  email: string;
  docType: string;
  docNumber: string;
  paymentMethodId: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  paymentMethodId: number;
  paymentMethodName: string;
  amount: number;
  date: string;
  isOnline: boolean;
  transactionCode: string;
  provider: string;
  status: string;
}
