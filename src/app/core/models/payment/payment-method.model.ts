export interface PaymentMethodResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  provider: string;
}

export interface PaymentMethodRequest {
  code: string;
  name: string;
  description?: string;
  lang?: string;
}
