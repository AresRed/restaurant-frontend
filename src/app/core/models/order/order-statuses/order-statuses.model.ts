
export interface OrderStatusResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  lang: string;
}

export interface OrderStatusRequest {
  code: string;
  name: string;
  description?: string;
  lang: string;
}

