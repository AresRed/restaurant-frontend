export interface OrderDetailRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  statusId: number;
  typeId: number;
  addressId: number;
  details: OrderDetailRequest[];
}

export interface OrderResponse {
  id: number;
  statusId: number;
  typeId: number;
  addressId: number;
  total: number;
  createdAt: string;
  details: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}
